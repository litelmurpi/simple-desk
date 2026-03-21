<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'uts', 'color' => '#EF4444'],
            ['name' => 'uas', 'color' => '#EF4444'],
            ['name' => 'kelompok', 'color' => '#3B82F6'],
            ['name' => 'individu', 'color' => '#8B5CF6'],
            ['name' => 'penting', 'color' => '#EAB308'],
            ['name' => 'referensi', 'color' => '#14B8A6']
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
