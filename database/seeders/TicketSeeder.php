<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\Tag;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjectStrukturData = Subject::where('code', '=', 'CS201')->first();
        $subjectWebDev = Subject::where('code', '=', 'CS305')->first();
        
        $tagUts = Tag::where('name', '=', 'uts')->first();
        $tagKelompok = Tag::where('name', '=', 'kelompok')->first();

        $tickets = [
            [
                'ticket_number' => 'SD-0001',
                'title' => 'Tugas Besar Web Dev',
                'description' => 'Membuat portal berita sederhana dengan Laravel dan React.',
                'type' => 'project',
                'status' => 'in_progress',
                'priority' => 'high',
                'subject_id' => $subjectWebDev?->id,
                'deadline_at' => Carbon::now()->addDays(5)->setTime(23, 59),
            ],
            [
                'ticket_number' => 'SD-0002',
                'title' => 'Implementasi AVL Tree',
                'description' => 'Tugas praktikum struktur data minggu ke-7.',
                'type' => 'tugas',
                'status' => 'open',
                'priority' => 'medium',
                'subject_id' => $subjectStrukturData?->id,
                'deadline_at' => Carbon::now()->addDays(2)->setTime(23, 59),
            ],
            [
                'ticket_number' => 'SD-0003',
                'title' => 'Baca Jurnal Pemrograman Web',
                'description' => 'Review 3 jurnal tentang arsitektur frontend.',
                'type' => 'todo',
                'status' => 'done',
                'priority' => 'low',
                'subject_id' => $subjectWebDev?->id,
                'deadline_at' => Carbon::now()->subDays(1)->setTime(23, 59),
                'completed_at' => Carbon::now()->subDays(2),
            ]
        ];

        foreach ($tickets as $index => $ticketData) {
            $ticket = Ticket::create($ticketData);
            
            if ($index === 0 && $tagKelompok) {
                $ticket->tags()->attach([$tagKelompok->id]);
            }
            if ($index === 1 && $tagUts) {
                $ticket->tags()->attach([$tagUts->id]);
            }
        }
    }
}
