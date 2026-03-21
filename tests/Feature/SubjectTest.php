<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Subject;

class SubjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_subjects(): void
    {
        $response = $this->get('/subjects');
        $response->assertStatus(200);
    }

    public function test_can_create_subject(): void
    {
        $response = $this->post('/settings/subjects', [
            'name' => 'Software Engineering',
            'code' => 'SE101',
            'color' => '#3B82F6',
            'semester' => 4,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('subjects', [
            'name' => 'Software Engineering',
            'code' => 'SE101',
        ]);
    }

    public function test_can_update_subject(): void
    {
        $subject = Subject::create([
            'name' => 'Old Math',
            'code' => 'MTH',
            'color' => '#000000',
            'semester' => 1,
            'is_active' => true,
        ]);

        $response = $this->put("/settings/subjects/{$subject->id}", [
            'name' => 'New Math',
            'code' => 'MTH101',
            'color' => '#FFFFFF',
            'semester' => 2,
            'is_active' => false,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('subjects', [
            'id' => $subject->id,
            'name' => 'New Math',
            'is_active' => false,
        ]);
    }
}
