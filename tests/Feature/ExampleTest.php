<?php

namespace Tests\Feature;

<<<<<<< HEAD
use Illuminate\Foundation\Testing\RefreshDatabase;
=======
// use Illuminate\Foundation\Testing\RefreshDatabase;
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
<<<<<<< HEAD
     *
     * @return void
     */
    public function test_the_application_returns_a_successful_response()
=======
     */
    public function test_the_application_returns_a_successful_response(): void
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
