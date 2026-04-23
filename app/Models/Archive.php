<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Archive extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'archive_number',
        'definitive_number',
        'temporary_number',
        'archivist_name',
        'series',
        'sub_series',
        'classification_code',
        'file_number',
        'description',
        'start_date',
        'end_date',
        'type',
        'status',
        'year',
        'retention_inactive_date',
        'retention_destruction_date',
        'is_notified',
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function retentionActions()
    {
        return $this->hasMany(RetentionAction::class);
    }

    public function classification()
    {
        return $this->belongsTo(RetentionSchedule::class, 'classification_code', 'code');
    }
}
