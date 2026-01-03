<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bidang;
use App\Models\Member;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function index()
    {
        // 1. AMBIL BPH INTI (Satria & Aisyah)
        // Logika: Tidak punya Bidang, Tidak punya Divisi
        $bph = Member::whereNull('bidang_id')
            ->whereNull('division_id')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($member) {
                return $this->formatMember($member);
            });

        // 2. AMBIL STRUKTUR BIDANG (Nabila, Ariel, dll)
        // Kita gunakan Eager Loading (with) agar query database hemat (N+1 Problem solved)
        $bidangs = Bidang::with([
            // Ambil Ketua Bidang (Member yang nempel langsung di Bidang)
            'members' => function ($query) {
                $query->orderBy('sort_order');
            },
            // Ambil Divisi di bawahnya, beserta Member-nya
            'divisions.members' => function ($query) {
                $query->orderBy('sort_order'); // Urutkan member (Ketua Divisi dulu, baru Staff)
            }
        ])
            ->get() // Ambil semua bidang
            ->map(function ($bidang) {
                return [
                    'id' => $bidang->id,
                    'name' => $bidang->bidang_name,
                    'slug' => $bidang->slug,

                    // Siapa Ketua Bidangnya? (Ambil dari relasi members di tabel bidang)
                    'head_of_bidang' => $bidang->members->map(function ($m) {
                        return $this->formatMember($m);
                    })->first(), // Ambil satu saja (Nabila)

                    // Daftar Divisi di bawah Bidang ini (Sosma, Humas)
                    'divisions' => $bidang->divisions->map(function ($divisi) {
                        return [
                            'id' => $divisi->id,
                            'name' => $divisi->divisi_name,
                            'members' => $divisi->members->map(function ($m) {
                                return $this->formatMember($m);
                            })
                        ];
                    })
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'bph_inti' => $bph,       // Level 1: Satria & Aisyah
                'departments' => $bidangs // Level 2 & 3: Bidang -> Divisi -> Member
            ]
        ]);
    }

    // Helper function untuk format output member agar seragam & URL foto benar
    private function formatMember($member)
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'position' => $member->position,
            // Pastikan image_url menjadi link lengkap (http://localhost/storage/...)
            'image_url' => $member->image_url ? asset('storage/' . $member->image_url) : null,
            'is_leader' => (bool) $member->is_leader,
            'sort_order' => $member->sort_order,
        ];
    }
}
