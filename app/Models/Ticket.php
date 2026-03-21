<?php

namespace App\Models;

use App\Services\TicketNumberGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'priority',
        'subject_id',
        'deadline_at',
        'completed_at',
        'is_archived',
        'ticket_number',
    ];

    protected $casts = [
        'deadline_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    protected static function booted()
    {
        static::creating(function ($ticket) {
            if (empty($ticket->ticket_number)) {
                $ticket->ticket_number = app(TicketNumberGenerator::class)->generate();
            }
        });
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'ticket_tag');
    }

    public function histories()
    {
        return $this->hasMany(TicketHistory::class);
    }

    public function notes()
    {
        return $this->hasMany(TicketNote::class)->oldest();
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class)->latest();
    }
    
    // Scopes for deadlines
    public function scopeOverdue($query)
    {
        return $query->where('status', '!=', 'done')
                     ->where('deadline_at', '<', now());
    }
    
    public function scopeDueToday($query)
    {
        return $query->where('status', '!=', 'done')
                     ->whereDate('deadline_at', now()->toDateString());
    }
    
    public function scopeDueThisWeek($query)
    {
        return $query->where('status', '!=', 'done')
                     ->whereBetween('deadline_at', [now()->startOfWeek(), now()->endOfWeek()]);
    }
}
