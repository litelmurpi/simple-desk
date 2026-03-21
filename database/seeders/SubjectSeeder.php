<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            ['name' => 'Struktur Data', 'code' => 'CS201', 'color' => '#3B82F6', 'semester' => 3, 'is_active' => true],
            ['name' => 'Web Development', 'code' => 'CS305', 'color' => '#EC4899', 'semester' => 3, 'is_active' => true],
            ['name' => 'Sistem Basis Data', 'code' => 'CS310', 'color' => '#EAB308', 'semester' => 3, 'is_active' => true],
            ['name' => 'Rekayasa Perangkat Lunak', 'code' => 'CS401', 'color' => '#22C55E', 'semester' => 3, 'is_active' => true],
            ['name' => 'Kalkulus II', 'code' => 'MA102', 'color' => '#F97316', 'semester' => 3, 'is_active' => true]
        ];

        foreach ($subjects as $subject) {
            Subject::create($subject);
        }
    }
}
