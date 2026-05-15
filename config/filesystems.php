<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
<<<<<<< HEAD
    | based disks are available to your application. Just store away!
=======
    | based disks are available to your application for file storage.
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
<<<<<<< HEAD
    | Here you may configure as many filesystem "disks" as you wish, and you
    | may even configure multiple disks of the same driver. Defaults have
    | been setup for each driver as an example of the required options.
    |
    | Supported Drivers: "local", "ftp", "sftp", "s3"
=======
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
<<<<<<< HEAD
            'root' => storage_path('app'),
=======
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
<<<<<<< HEAD
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
=======
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
<<<<<<< HEAD
=======
            'throw' => false,
            'report' => false,
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
