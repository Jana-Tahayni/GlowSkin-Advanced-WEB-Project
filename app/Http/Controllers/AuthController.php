<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use OpenApi\Attributes as OA;

#[OA\Info(
    title: "GlowSkin API",
    version: "1.0.0",
    description: "GlowSkin Advanced Web Project API Documentation"
)]
#[OA\Server(
    url: "http://localhost:8000",
    description: "Local Server"
)]
#[OA\SecurityScheme(
    securityScheme: "bearerAuth",
    type: "http",
    scheme: "bearer",
    bearerFormat: "Passport",
    description: "Laravel Passport Bearer Token"
)]
class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/auth/register",
        summary: "Register new user",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["first_name", "last_name", "email", "password", "password_confirmation", "terms"],
                properties: [
                    new OA\Property(property: "first_name", type: "string", example: "Afnan"),
                    new OA\Property(property: "last_name",  type: "string", example: "Test"),
                    new OA\Property(property: "email",      type: "string", example: "test@gmail.com"),
                    new OA\Property(property: "password",   type: "string", example: "Password123"),
                    new OA\Property(property: "password_confirmation", type: "string", example: "Password123"),
                    new OA\Property(property: "terms",      type: "boolean", example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Account created successfully"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name'             => 'required|string|max:100',
            'last_name'              => 'required|string|max:100',
            'email'                  => 'required|email|unique:users,email',
            'password'               => 'required|string|min:8|confirmed|regex:/[a-zA-Z]/|regex:/[0-9]/',
            'terms'                  => 'accepted',
        ], [
            'password.regex'         => 'Password must contain at least one letter and one number.',
            'terms.accepted'         => 'You must agree to the Terms of Service and Privacy Policy.',
            'email.unique'           => 'An account with this email already exists.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'provider'   => 'email',
        ]);

        $token = $user->createToken('GlowApp Personal Access Token')->accessToken;

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully. Welcome to your skin journey!',
            'data'    => [
                'user'         => $this->formatUser($user),
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ], 201);
    }

    #[OA\Post(
        path: "/api/auth/login",
        summary: "Login user",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email", "password"],
                properties: [
                    new OA\Property(property: "email",    type: "string", example: "test@gmail.com"),
                    new OA\Property(property: "password", type: "string", example: "Password123"),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Login successful"),
            new OA\Response(response: 401, description: "Invalid credentials"),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json([
                'success' => false,
                'message' => 'These credentials do not match our records.',
            ], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('GlowApp Personal Access Token')->accessToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully.',
            'data'    => [
                'user'         => $this->formatUser($user),
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ]);
    }

    #[OA\Get(
        path: "/api/auth/google",
        summary: "Get Google OAuth URL",
        tags: ["Auth"],
        responses: [
            new OA\Response(response: 200, description: "Google redirect URL returned"),
        ]
    )]
    public function redirectToGoogle(): JsonResponse
    {
        $url = Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json([
            'success'      => true,
            'redirect_url' => $url,
        ]);
    }

    #[OA\Get(
        path: "/api/auth/google/callback",
        summary: "Handle Google OAuth callback",
        tags: ["Auth"],
        responses: [
            new OA\Response(response: 200, description: "Login/Register via Google successful"),
            new OA\Response(response: 400, description: "Google authentication failed"),
        ]
    )]
    public function handleGoogleCallback(Request $request): JsonResponse
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Google authentication failed. Please try again.',
            ], 400);
        }

        $nameParts = explode(' ', trim($googleUser->getName()), 2);
        $firstName  = $nameParts[0] ?? '';
        $lastName   = $nameParts[1] ?? '';

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'first_name'        => $firstName,
                'last_name'         => $lastName,
                'provider'          => 'google',
                'provider_id'       => $googleUser->getId(),
                'avatar'            => $googleUser->getAvatar(),
                'password'          => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
            ]
        );

        $token = $user->createToken('GlowApp Google Token')->accessToken;

        return response()->json([
            'success' => true,
            'message' => $user->wasRecentlyCreated
                ? 'Account created via Google. Welcome!'
                : 'Logged in with Google successfully.',
            'data'    => [
                'user'         => $this->formatUser($user),
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ]);
    }

    #[OA\Get(
        path: "/api/auth/me",
        summary: "Get authenticated user",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "User data returned"),
            new OA\Response(response: 401, description: "Unauthorized"),
        ]
    )]
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => [
                'user' => $this->formatUser($request->user()),
            ],
        ]);
    }

    #[OA\Post(
        path: "/api/auth/logout",
        summary: "Logout current user",
        tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [
            new OA\Response(response: 200, description: "Logged out successfully"),
            new OA\Response(response: 401, description: "Unauthorized"),
        ]
    )]
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    private function formatUser(User $user): array
    {
        return [
            'id'         => $user->id,
            'first_name' => $user->first_name,
            'last_name'  => $user->last_name,
            'full_name'  => $user->first_name . ' ' . $user->last_name,
            'email'      => $user->email,
            'avatar'     => $user->avatar,
            'provider'   => $user->provider,
            'created_at' => $user->created_at,
        ];
    }
}