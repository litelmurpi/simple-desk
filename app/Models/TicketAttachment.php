<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketAttachment extends Model
{
    protected $fillable = [
        'ticket_id',
        'ticket_note_id',
        'file_path',
        'file_name',
        'mime_type',
        'file_size'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function note()
    {
        return $this->belongsTo(TicketNote::class, 'ticket_note_id');
    }
}
