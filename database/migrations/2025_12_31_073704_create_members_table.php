<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            // FK 1: Ke Bidang (Boleh NULL untuk Kepala Divisi, Staff Divisi, dan Ketua Umum)
            $table->foreignId('bidang_id')->nullable()->constrained('bidangs')->onDelete('cascade');
            // FK 2: Ke Divisi (Boleh NULL untuk Kepala Bidang & Ketua Umum)
            $table->foreignId('division_id')->nullable()->constrained('divisions')->onDelete('cascade');
            $table->string('name');
            $table->string('position');
            $table->string('image_url')->nullable();
            $table->boolean('is_leader')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
