<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmailMail;
use App\Models\PendingUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use OpenApi\Attributes as OA;

#[OA\Info(title: "GlowSkin API", version: "1.0.0", description: "GlowSkin Advanced Web Project API Documentation")]
#[OA\Server(url: "http://localhost:8000", description: "Local Server")]
#[OA\SecurityScheme(securityScheme: "bearerAuth", type: "http", scheme: "bearer", bearerFormat: "Passport")]
class AuthController extends Controller
{
    // =========================================================
    //  REGISTRATION  (step 1 – save to pending, send email)
    // =========================================================

    #[OA\Post(
        path: "/api/auth/register",
        summary: "Begin registration – sends verification email",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["first_name", "last_name", "email", "password", "password_confirmation", "terms"],
                properties: [
                    new OA\Property(property: "first_name",             type: "string",  example: "Afnan"),
                    new OA\Property(property: "last_name",              type: "string",  example: "Test"),
                    new OA\Property(property: "email",                  type: "string",  example: "test@gmail.com"),
                    new OA\Property(property: "password",               type: "string",  example: "Password123"),
                    new OA\Property(property: "password_confirmation",  type: "string",  example: "Password123"),
                    new OA\Property(property: "terms",                  type: "boolean", example: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: "Verification email sent"),
            new OA\Response(response: 422, description: "Validation error"),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name'            => 'required|string|max:100',
            'last_name'             => 'required|string|max:100',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed|regex:/[a-zA-Z]/|regex:/[0-9]/',
            'terms'                 => 'accepted',
        ], [
            'password.regex'        => 'Password must contain at least one letter and one number.',
            'terms.accepted'        => 'You must agree to the Terms of Service and Privacy Policy.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors'  => $validator->errors(),
            ], 422);
        }

        // ── Guard: email already fully registered ──
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An account with this email already exists.',
                'errors'  => ['email' => ['An account with this email already exists.']],
            ], 422);
        }

        // ── Guard: pending record exists ──
        $existing = PendingUser::where('email', $request->email)->first();
        if ($existing) {
            // Resend a fresh token rather than creating a duplicate
            $this->refreshPendingToken($existing);

            return response()->json([
                'success' => false,
                'message' => 'This email is already awaiting verification. A new verification link has been sent.',
                'errors'  => ['email' => ['Please check your inbox (or spam) for the verification link.']],
            ], 422);
        }

        // ── Create pending record ──
        $token   = Str::random(64);
        $pending = PendingUser::create([
            'first_name'         => $request->first_name,
            'last_name'          => $request->last_name,
            'email'              => $request->email,
            'password'           => Hash::make($request->password),
            'verification_token' => $token,
            'token_expires_at'   => now()->addMinutes(15),
        ]);

        Mail::to($pending->email)->send(new VerifyEmailMail($pending->first_name, $token));

        return response()->json([
            'success' => true,
            'message' => 'Account registration started. Please check your email to verify your address (link valid for 15 minutes).',
        ], 201);
    }

    // =========================================================
    //  EMAIL VERIFICATION  (step 2 – user clicks link)
    // =========================================================

    #[OA\Get(
        path: "/api/auth/verify/{token}",
        summary: "Verify email via token",
        tags: ["Auth"],
        parameters: [new OA\Parameter(name: "token", in: "path", required: true, schema: new OA\Schema(type: "string"))],
        responses: [
            new OA\Response(response: 200, description: "Email verified, account created"),
            new OA\Response(response: 410, description: "Token expired – new link sent or record deleted"),
            new OA\Response(response: 404, description: "Token not found"),
        ]
    )]
    public function verifyEmail(string $token): JsonResponse
    {
        $pending = PendingUser::where('verification_token', $token)->first();

        // ── Token not found at all ──
        if (!$pending) {
            return response()->json([
                'success' => false,
                'message' => 'Verification link is invalid or has already been used.',
            ], 404);
        }

        // ── Older than 24 hours → delete permanently ──
        if ($pending->isOlderThan24Hours()) {
            $pending->delete();

            return response()->json([
                'success' => false,
                'message' => 'Verification expired. Please register again.',
            ], 410);
        }

        // ── Token expired but within 24 hours → send a fresh link ──
        if ($pending->isTokenExpired()) {
            $this->refreshPendingToken($pending);

            return response()->json([
                'success' => false,
                'message' => 'Your verification link expired, a new one has been sent to your email.',
            ], 410);
        }

        // ── Token is valid → promote to real user ──
        $user = User::create([
            'first_name'        => $pending->first_name,
            'last_name'         => $pending->last_name,
            'email'             => $pending->email,
            'password'          => $pending->password,   // already hashed
            'provider'          => 'email',
            'email_verified_at' => now(),
        ]);

        $pending->delete();

        $token = $user->createToken('GlowApp Personal Access Token')->accessToken;

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully. Welcome to GlowSkin!',
            'data'    => [
                'user'         => $this->formatUser($user),
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ]);
    }

    // =========================================================
    //  RESEND VERIFICATION
    // =========================================================

    #[OA\Post(
        path: "/api/auth/resend-verification",
        summary: "Resend verification email",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["email"],
                properties: [new OA\Property(property: "email", type: "string", example: "test@gmail.com")]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: "Verification email resent"),
            new OA\Response(response: 422, description: "Not a pending email"),
        ]
    )]
    public function resendVerification(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), ['email' => 'required|email']);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Already verified?
        if (User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already verified. Please log in.',
            ], 422);
        }

        $pending = PendingUser::where('email', $request->email)->first();

        if (!$pending) {
            return response()->json([
                'success' => false,
                'message' => 'No pending registration found for this email. Please register first.',
            ], 422);
        }

        // If older than 24 h, wipe it — user must start over
        if ($pending->isOlderThan24Hours()) {
            $pending->delete();

            return response()->json([
                'success' => false,
                'message' => 'Your registration has expired. Please register again.',
            ], 422);
        }

        $this->refreshPendingToken($pending);

        return response()->json([
            'success' => true,
            'message' => 'A new verification link has been sent to your email.',
        ]);
    }

    // =========================================================
    //  LOGIN
    // =========================================================

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
            new OA\Response(response: 403, description: "Email not verified"),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // ── Email is stuck in pending ──
        if (PendingUser::where('email', $request->email)->exists()) {
            return response()->json([
                'success'      => false,
                'message'      => 'This email is not yet verified. Please check your email or request a new verification link.',
                'action'       => 'resend_verification',   // hint for the frontend
                'email'        => $request->email,
            ], 403);
        }

        // ── Email not in either table ──
        if (!User::where('email', $request->email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email is not registered. Please create a new account.',
                'action'  => 'register',   // hint: frontend should redirect to register tab
                'email'   => $request->email,
            ], 404);
        }

        // ── Attempt authentication ──
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

    // =========================================================
    //  GOOGLE OAUTH
    // =========================================================

    #[OA\Get(path: "/api/auth/google", summary: "Get Google OAuth redirect URL", tags: ["Auth"],
        responses: [new OA\Response(response: 200, description: "Redirect URL returned")])]
    public function redirectToGoogle(): JsonResponse
    {
        $url = Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['success' => true, 'redirect_url' => $url]);
    }

    #[OA\Get(path: "/api/auth/google/callback", summary: "Handle Google OAuth callback", tags: ["Auth"],
        responses: [
            new OA\Response(response: 200, description: "Google login/register successful"),
            new OA\Response(response: 400, description: "Google authentication failed"),
            new OA\Response(response: 403, description: "Pending email must be verified first"),
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

        $email = $googleUser->getEmail();

        // ── Email is stuck in pending ──
        if (PendingUser::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'An account with this email is waiting for email verification. Please verify your email or request a new verification link.',
                'action'  => 'resend_verification',
                'email'   => $email,
            ], 403);
        }

        // ── Parse name ──
        $nameParts = explode(' ', trim($googleUser->getName()), 2);
        $firstName = $nameParts[0] ?? '';
        $lastName  = $nameParts[1] ?? '';

        // ── Existing user → login; new user → create ──
        $isNew = !User::where('email', $email)->exists();

        $user = User::updateOrCreate(
            ['email' => $email],
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
            'message' => $isNew ? 'Account created via Google. Welcome!' : 'Welcome back.',
            'data'    => [
                'user'         => $this->formatUser($user),
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ],
        ]);
    }

    // =========================================================
    //  ME / LOGOUT
    // =========================================================

    #[OA\Get(path: "/api/auth/me", summary: "Get authenticated user", tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [new OA\Response(response: 200, description: "User data returned")])]
    public function me(Request $request): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['user' => $this->formatUser($request->user())]]);
    }

    #[OA\Post(path: "/api/auth/logout", summary: "Logout current user", tags: ["Auth"],
        security: [["bearerAuth" => []]],
        responses: [new OA\Response(response: 200, description: "Logged out")])]
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return response()->json(['success' => true, 'message' => 'Logged out successfully.']);
    }

    // =========================================================
    //  PRIVATE HELPERS
    // =========================================================

    /**
     * Generate a new token, push the expiry to +15 min, and re-send the email.
     */
    private function refreshPendingToken(PendingUser $pending): void
    {
        $newToken = Str::random(64);
        $pending->update([
            'verification_token' => $newToken,
            'token_expires_at'   => now()->addMinutes(15),
        ]);

        Mail::to($pending->email)->send(new VerifyEmailMail($pending->first_name, $newToken));
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