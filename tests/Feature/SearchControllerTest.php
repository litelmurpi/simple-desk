<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Ticket;
use App\Models\Subject;
use App\Models\Tag;

class SearchControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_search_tickets()
    {
        Ticket::create([
            'ticket_number' => 'SD-2001',
            'title' => 'Fix the login page',
            'type' => 'todo',
            'status' => 'open',
            'priority' => 'high'
        ]);

        $response = $this->get('/api/search?q=login');
        
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'tickets');
        $response->assertJsonFragment(['title' => 'Fix the login page']);
    }

    public function test_empty_query_returns_empty_results()
    {
        $response = $this->get('/api/search?q=');
        
        $response->assertStatus(200);
        $response->assertJson([
            'tickets' => [],
            'subjects' => [],
            'tags' => []
        ]);
    }

    public function test_can_search_subjects_and_tags()
    {
        Subject::create(['name' => 'Mathematics', 'code' => 'MAT101', 'color' => '#ff0000']);
        Tag::create(['name' => 'urgent', 'color' => '#ff0000']);

        $response = $this->get('/api/search?q=mat');
        
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'subjects');
        $response->assertJsonFragment(['name' => 'Mathematics']);
    }
}
