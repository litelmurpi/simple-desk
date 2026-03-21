<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketNoteVersion extends Model
{
    protected $fillable = ['ticket_note_id', 'body', 'version_number'];

    public function note()
    {
        return $this->belongsTo(TicketNote::class, 'ticket_note_id');
    }
}
