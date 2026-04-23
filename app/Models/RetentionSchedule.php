<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RetentionSchedule extends Model
{
    protected $fillable = [
        'code',
        'name',
        'active_retention',
        'inactive_retention',
        'final_disposition',
        'active_retention_notes',
        'inactive_retention_notes',
        'final_disposition_notes',
        'is_classification',
    ];
}
