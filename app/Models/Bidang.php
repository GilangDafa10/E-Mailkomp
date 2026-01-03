<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bidang extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    // 1. Relasi Bidang ke Divisi (One to Many)
    public function divisions()
    {
        return $this->hasMany(Division::class)->orderBy('sort_order');
    }

    // 2. Relasi Bidang ke Member (One to Many)
    public function members()
    {
        return $this->hasMany(Member::class);
    }
}
