<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetentionAction extends Model
{
    use HasFactory;

    protected $fillable = [
        'archive_id',
        'action_type',
        'file_path',
        'completed_at',
    ];

    public function archive()
    {
        return $this->belongsTo(Archive::class);
    }
}
