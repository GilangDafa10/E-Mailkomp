<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\NewsCategoryController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Api\OrganizationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Endpoint ini akan dipanggil frontend: GET /api/structure
Route::get('/structure', [OrganizationController::class, 'index']);

// Articles
Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index']); // List all articles with filters
    Route::get('/{slug}', [ArticleController::class, 'show']); // Get single article
    Route::get('/category/{category}', [ArticleController::class, 'byCategory']); // Get articles by category
    Route::get('/search/{query}', [ArticleController::class, 'search']); // Search articles
});

// Categories
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']); // List all categories
    Route::get('/{id}/articles', [CategoryController::class, 'articles']); // Get articles for a category
});

// Events
Route::get('/events', [EventController::class, 'index']); // Untuk mendapatkan semua event
Route::get('/events/{id}', [EventController::class, 'show']); // Untuk mendapatkan event berdasarkan ID

// News
Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index']); // List semua berita dengan filter
    Route::get('/{slug}', [NewsController::class, 'show']); // Ambil satu berita berdasarkan slug
    Route::get('/category/{category}', [NewsController::class, 'byCategory']); // Berita berdasarkan kategori
    Route::get('/search/{query}', [NewsController::class, 'search']); // Pencarian berita
});

// News Categories
Route::prefix('news-categories')->group(function () {
    Route::get('/', [NewsCategoryController::class, 'index']); // List semua kategori berita
    Route::get('/{id}/news', [NewsCategoryController::class, 'news']); // Ambil berita berdasarkan kategori
});

// Contact form endpoint (does not require authentication)
Route::post('/contact', [ContactController::class, 'send']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
