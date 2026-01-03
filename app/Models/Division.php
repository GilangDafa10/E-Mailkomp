<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    // 1. Relasi Divisi ke Bidang
    public function bidang()
    {
        return $this->belongsTo(Bidang::class);
    }

    // 2. Relasi Divisi ke Member
    public function members()
    {
        return $this->hasMany(Member::class)->orderBy('sort_order');
    }
}
