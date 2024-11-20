<?php
/*
 * Plugin Name: Product Table For WooCommerce
 * Version: 1.2.3
 * Description: This plugin helps to show products in table layout
 * Author: Acowebs
 * Author URI: http://acowebs.com
 * Requires at least: 4.9
 * Tested up to: 6.4
 * Text Domain: product-table-for-woocommerce
 * WC requires at least: 3.4.4
 * WC tested up to: 8.4
*/
define('AWCPT_TOKEN', 'awcpt');
define('AWCPT_VERSION', '1.2.3');
define('AWCPT_FILE', __FILE__);
define('AWCPT_PLUGIN_NAME', 'Product Table For WooCommerce');
define('AWCPT_WP_VERSION', get_bloginfo('version'));
define('AWCPT_STORE_URL', 'https://api.acowebs.com');

//Helpers
require_once(realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes/helpers.php');

//Init
add_action('plugins_loaded', 'AWCPT_init');
if (!function_exists('AWCPT_init')) {
    function AWCPT_init()
    {
        $plugin_rel_path = basename(dirname(__FILE__)) . '/languages'; /* Relative to WP_PLUGIN_DIR */
        load_plugin_textdomain( 'product-table-for-woocommerce', false, $plugin_rel_path );
    }

}

//Loading Classes
if (!function_exists('AWCPT_autoloader')) {

    function AWCPT_autoloader($class_name)
    {
        if (0 === strpos($class_name, 'AWCPT')) {
            $classes_dir = realpath(plugin_dir_path(__FILE__)) . DIRECTORY_SEPARATOR . 'includes' . DIRECTORY_SEPARATOR;
            $class_file = 'class-' . str_replace('_', '-', strtolower($class_name)) . '.php';
            require_once $classes_dir . $class_file;
        }
    }

}
spl_autoload_register('AWCPT_autoloader');

//Backend UI
if (!function_exists('AWCPT')) {
    function AWCPT()
    {
        $instance = AWCPT_Backend::instance(__FILE__, AWCPT_VERSION);
        return $instance;
    }

}



if (is_admin()) {
    AWCPT();
}

//API
new AWCPT_Api();

// Front end
new AWCPT_Front_End( __FILE__, AWCPT_VERSION );


add_action( 'before_woocommerce_init', function() {
	if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
		\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
	}
} );
