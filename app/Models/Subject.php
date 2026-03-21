<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'color',
        'semester',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'semester' => 'integer',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
