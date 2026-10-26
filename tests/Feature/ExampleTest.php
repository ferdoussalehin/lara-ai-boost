<?php
use App\Models\User;

it('returns a successful response', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
});
/*
 * Doesn't work due to pest version issue
it('may login', function() {
    $user = User::factory()->create();

    visit(route('login'))
        ->type('email', $user->email)
        ->type('password', 'password')
        ->press('continue')
        ->assertSee('Dashboard');
    $this->assertAuthenticatedAs($user);
});
 */