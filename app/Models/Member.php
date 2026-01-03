<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    // Member mungkin saja memiliki Bidang
    public function bidang()
    {
        return $this->belongsTo(Bidang::class);
    }

    // Member mungkin saja memiliki Divisi
    public function division()
    {
        return $this->belongsTo(Division::class);
    }
}
