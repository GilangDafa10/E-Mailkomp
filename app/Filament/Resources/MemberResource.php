<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MemberResource\Pages;
use App\Filament\Resources\MemberResource\RelationManagers;
use App\Models\Member;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Nette\Utils\Image;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Toggle;

class MemberResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'EM Structured';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Informasi Anggota')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->label('Nama Lengkap'),

                        TextInput::make('position')
                            ->required()
                            ->label('Jabatan Tertulis')
                            ->placeholder('Contoh: Ketua Umum / Staff Divisi'),

                        FileUpload::make('image_url')
                            ->image()
                            ->imageEditor()
                            ->disk('public')
                            ->directory('MembersImages')
                            ->visibility('public')
                            ->label('Foto Profil')
                            ->previewable(true)
                            ->downloadable(false)
                            ->maxSize(5120) // 5MB
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            // ->optimize('webp')
                            ->lazy(),
                    ])->columns(2),

                Section::make('Penempatan & Level')
                    ->description('Penting: Tentukan posisi anggota dalam struktur.')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                // LOGIKA HIERARKI DI SINI
                                Select::make('bidang_id')
                                    ->relationship(
                                        'bidang',
                                        'bidang_name',
                                        modifyQueryUsing: fn($query) => $query->orderBy('bidang_name')
                                    )
                                    ->label('Ketua Bidang (Induk)')
                                    ->helperText('ISI INI HANYA JIKA dia Ketua Bidang (Nabila). Kosongkan jika Staff/Ketum.'),

                                Select::make('division_id')
                                    ->relationship(
                                        'division',
                                        'divisi_name',
                                        modifyQueryUsing: fn($query) => $query->orderBy('divisi_name')
                                    )
                                    ->label('Anggota Divisi')
                                    ->helperText('ISI INI HANYA JIKA dia masuk Divisi (Ariel/Radit).'),
                            ]),

                        Toggle::make('is_leader')
                            ->label('Apakah dia Pimpinan?')
                            ->helperText('Aktifkan untuk Ketua Umum, Ketua Bidang, atau Ketua Divisi agar foto tampil beda/besar.')
                            ->onColor('primary')
                            ->offColor('danger'),

                        TextInput::make('sort_order')
                            ->numeric()
                            ->default(1)
                            ->label('Urutan Tampil'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_url')
                    ->label('Foto Anggota')
                    ->disk('public')
                    ->getStateUsing(fn($record) => asset('storage/' . $record->image_url))
                    ->width(50)
                    ->height(50),
                TextColumn::make('name')
                    ->label('Nama Anggota')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('position')
                    ->label('Jabatan'),
                // Custom Column untuk melihat dia masuk mana
                TextColumn::make('status_penempatan')
                    ->label('Penempatan')
                    ->getStateUsing(function ($record) {
                        if (!$record->bidang_id && !$record->division_id) {
                            return '⭐ Ketua & Wakil Umum';
                        }
                        if ($record->bidang_id && !$record->division_id) {
                            return '🔹 Bidang: ' . $record->bidang->bidang_name;
                        }
                        if ($record->division_id && $record->bidang_id) {
                            return '🔸 Divisi: ' . $record->division->divisi_name;
                        }
                    })
                    ->badge()
                    ->colors([
                        'success' => fn($state) => str_contains($state, 'Ketua & Wakil Umum'),
                        'warning' => fn($state) => str_contains($state, 'Bidang'),
                        'info' => fn($state) => str_contains($state, 'Divisi'),
                    ]),
                TextColumn::make('is_leader')
                    ->label('Kepala atau Tidak')
                    ->getStateUsing(fn($record) => $record->is_leader ? 'Ya' : 'Tidak')
                    ->badge()
                    ->colors([
                        'primary' => fn($state) => $state === 'Ya',
                        'secondary' => fn($state) => $state === 'Tidak',
                    ]),
                TextColumn::make('sort_order')
                    ->label('Urutan Tampil'),
            ])
            ->filters([
                // Filter untuk memudahkan pencarian
                Tables\Filters\SelectFilter::make('bidang_id')
                    ->relationship(
                        'bidang',
                        'bidang_name',
                        modifyQueryUsing: fn($query) => $query->orderBy('bidang_name')
                    )
                    ->label('Bidang'),
                Tables\Filters\SelectFilter::make('division_id')
                    ->relationship(
                        'division',
                        'divisi_name',
                        modifyQueryUsing: fn($query) => $query
                            ->when(
                                request()->query('tableFilters.bidang_id'),
                                fn($q) => $q->where('bidang_id', request()->query('tableFilters.bidang_id'))
                            )
                            ->orderBy('divisi_name')
                    )
                    ->label('Divisi'),
                Tables\Filters\TernaryFilter::make('is_leader')
                    ->label('Filter Pimpinan'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery()->with(['bidang', 'division']);

        // Jika filter bidang dipilih, hanya tampilkan members dari bidang tersebut
        if (request()->query('tableFilters.bidang_id')) {
            $bidangId = request()->query('tableFilters.bidang_id');
            $query->where(function ($q) use ($bidangId) {
                $q->where('bidang_id', $bidangId)
                    ->orWhereHas('division', fn($dq) => $dq->where('bidang_id', $bidangId));
            });
        }

        return $query;
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMembers::route('/'),
            'create' => Pages\CreateMember::route('/create'),
            'edit' => Pages\EditMember::route('/{record}/edit'),
        ];
    }
}
