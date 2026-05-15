<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
        'name' => 'Dr. Lujain Rashid',
        'email' => 'thabttmt@gmail.com',
        'password' => Hash::make('password123'),
        'role' => 'doctor',
    ]);

    User::create([
        'name' => 'Sara Ahmad',
        'email' => 'ljynslyman1@gmail.com',
        'password' => Hash::make('password123'),
        'skin_type' => 'Oily',
        'role' => 'user',
    ]);

    User::create([
        'name' => 'Ahmad Ali',
        'email' => 'shehab9678@gmail.com',
        'password' => Hash::make('password123'),
        'skin_type' => 'Dry',
        'role' => 'user',
    ]);
    }
}
