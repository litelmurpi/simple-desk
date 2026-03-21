<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketNote extends Model
{
    protected $fillable = ['ticket_id', 'body'];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function versions()
    {
        return $this->hasMany(TicketNoteVersion::class)->orderBy('version_number', 'desc');
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }
}
