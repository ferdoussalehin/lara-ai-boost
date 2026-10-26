<?php

use App\Models\Category;
use App\Models\User;

test('categories', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $response = $this->get('/categories');

    $response->assertStatus(200);
});

test('category is inserted', function(){
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('categories.store'), [
        'name' => 'Test name',
        'description' => 'Test description',
        'slug' => 'test-name',
        'active' => 1,
    ]);
    $this->assertEquals(1, Category::count());
});