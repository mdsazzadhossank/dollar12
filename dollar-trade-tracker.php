<?php
/**
 * Plugin Name: Dollar Trade Tracker
 * Description: AI-powered currency trading dashboard built with React.
 * Version: 1.0.1
 * Author: AI Dev
 * Text Domain: dollar-trade-tracker
 */

if (!defined('ABSPATH')) {
    exit;
}

// 1. Register the admin menu
function dtt_add_admin_menu() {
    add_menu_page(
        'Dollar Tracker',        // Page Title
        'Dollar Tracker',        // Menu Title
        'manage_options',        // Capability
        'dollar-trade-tracker',  // Menu Slug
        'dtt_render_app',        // Callback function
        'dashicons-chart-line',  // Icon
        3                        // Position
    );
}
add_action('admin_menu', 'dtt_add_admin_menu');

// 2. Render the React root container
function dtt_render_app() {
    echo '<div id="dollar-trade-tracker-root" class="dtt-wrapper"></div>';
}

// 3. Register REST API Endpoints
function dtt_register_routes() {
    register_rest_route('dollar-tracker/v1', '/transactions', [
        [
            'methods' => 'GET',
            'callback' => 'dtt_get_transactions',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ],
        [
            'methods' => 'POST',
            'callback' => 'dtt_update_transactions',
            'permission_callback' => function () {
                return current_user_can('manage_options');
            }
        ]
    ]);
}
add_action('rest_api_init', 'dtt_register_routes');

// Callback: Get Transactions
function dtt_get_transactions() {
    $transactions = get_option('dtt_transactions', []);
    if (!is_array($transactions)) {
        $transactions = [];
    }
    return rest_ensure_response($transactions);
}

// Callback: Update Transactions
function dtt_update_transactions($request) {
    $params = $request->get_json_params();
    if (is_array($params)) {
        update_option('dtt_transactions', $params);
        return rest_ensure_response(['success' => true]);
    }
    return new WP_Error('invalid_data', 'Invalid data provided', ['status' => 400]);
}

// 4. Enqueue Scripts and Styles
function dtt_enqueue_scripts($hook) {
    if ($hook != 'toplevel_page_dollar-trade-tracker') {
        return;
    }

    $build_dir = plugin_dir_url(__FILE__) . 'build/';
    $build_path = plugin_dir_path(__FILE__) . 'build/';

    // Dynamic versioning based on file modification time to prevent caching issues
    $css_ver = file_exists($build_path . 'index.css') ? filemtime($build_path . 'index.css') : '1.0.0';
    $js_ver = file_exists($build_path . 'index.js') ? filemtime($build_path . 'index.js') : '1.0.0';

    // A. Enqueue Tailwind CSS & Custom Styles
    if (file_exists($build_path . 'index.css')) {
        wp_enqueue_style('dtt-react-styles', $build_dir . 'index.css', [], $css_ver);
    }

    // B. Enqueue Fonts (Inter)
    wp_enqueue_style('google-fonts-inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', [], null);

    // C. Enqueue the React Build
    if (file_exists($build_path . 'index.js')) {
        wp_enqueue_script('dtt-react-app', $build_dir . 'index.js', ['wp-element'], $js_ver, true);
        
        wp_localize_script('dtt-react-app', 'dttSettings', [
            'nonce' => wp_create_nonce('wp_rest'),
            'root' => esc_url_raw(rest_url()),
        ]);
    }
}
add_action('admin_enqueue_scripts', 'dtt_enqueue_scripts');

// 5. Add type="module" to the script tag for Vite
function dtt_add_type_attribute($tag, $handle, $src) {
    if ('dtt-react-app' !== $handle) {
        return $tag;
    }
    return '<script type="module" src="' . esc_url($src) . '"></script>';
}
add_filter('script_loader_tag', 'dtt_add_type_attribute', 10, 3);
?>