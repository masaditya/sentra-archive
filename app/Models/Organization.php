<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'phone',
        'head_name',
        'description',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function archives()
    {
        return $this->hasMany(Archive::class);
    }
}
