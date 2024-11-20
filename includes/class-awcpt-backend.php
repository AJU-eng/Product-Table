<?php
if (!defined('ABSPATH'))
    exit;

class AWCPT_Backend
{
    /**
     * @var    object
     * @access  private
     * @since    1.0.0
    */
    private static $_instance = null;

    /**
     * The version number.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $_version;

    /**
     * The token.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $_token;

    /**
     * The main plugin file.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $file;

    /**
     * The main plugin directory.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $dir;

    /**
     * The plugin assets directory.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $assets_dir;

    /**
     * Suffix for Javascripts.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $script_suffix;

    /**
     * The plugin assets URL.
     * @var     string
     * @access  public
     * @since   1.0.0
    */
    public $assets_url;
    public $hook_suffix = array();

    /**
     * Constructor function.
     * @access  public
     * @return  void
     * @since   1.0.0
    */
    public function __construct( $file = '', $version = '1.0.0' )
    {
        $this->_version = $version;
        $this->_token = AWCPT_TOKEN;
        $this->file = $file;
        $this->dir = dirname( $this->file );
        $this->assets_dir = trailingslashit( $this->dir ) . 'assets';
        $this->assets_url = esc_url( trailingslashit( plugins_url( '/assets/', $this->file ) ) );
        $this->script_suffix = defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ? '' : '.min';
        //reg activation hook
        register_activation_hook( $this->file, array( $this, 'install' ) );
        // reg post type
        add_action( 'init', array( $this, 'awcpt_post_types' ) );
        //reg admin menu
        add_action( 'admin_menu', array( $this, 'register_root_page' ), 30 );
        //enqueue scripts & styles
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 10, 1 );
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_styles' ), 10, 1 );
        $plugin = plugin_basename($this->file);
        //add action links to link to link list display on the plugins page
        add_filter( "plugin_action_links_$plugin", array( $this, 'add_settings_link' ) );
        // deactivation form
        add_action( 'admin_footer', array($this, 'aco_deactivation_form') );
    }

    /**
     *
     *
     * Ensures only one instance of AWCPT is loaded or can be loaded.
     *
     * @return Main AWCPT instance
     * @see WordPress_Plugin_Template()
     * @since 1.0.0
     * @static
    */
    public static function instance($file = '', $version = '1.0.0')
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($file, $version);
        }
        return self::$_instance;
    }

    /**
     * Installation. Runs on activation.
     * @access  public
     * @return  void
     * @since   1.0.0
    */
    public function install()
    {
        if ( $this->is_woocommerce_activated() === false ) {
			add_action( 'admin_notices', array ( $this, 'notice_need_woocommerce' ) );
			return;
        }

        $this->add_settings_options();
        flush_rewrite_rules();
    }

    /**
	 * Check if woocommerce is activated
     * @access  public
     * @return  boolean woocommerce install status
	*/
    public function is_woocommerce_activated()
    {
		$blog_plugins = get_option( 'active_plugins', array() );
		$site_plugins = is_multisite() ? (array) maybe_unserialize( get_site_option('active_sitewide_plugins' ) ) : array();

		if ( in_array( 'woocommerce/woocommerce.php', $blog_plugins ) || isset( $site_plugins['woocommerce/woocommerce.php'] ) ) {
			return true;
		} else {
			return false;
		}
    }

    /**
	 * WooCommerce not active notice.
     * @access  public
	 * @return string Fallack notice.
	*/
    public function notice_need_woocommerce()
    {
		$error = sprintf( __( AWCPT_PLUGIN_NAME.' requires %sWooCommerce%s to be installed & activated!' , 'product-table-for-woocommerce' ), '<a href="http://wordpress.org/extend/plugins/woocommerce/">', '</a>' );
		$message = '<div class="error"><p>' . $error . '</p></div>';
		echo $message;
    }

    /**
	 * Add plugin basic settings
     * @access private
	*/
    private function add_settings_options()
    {
        // Log the plugin version number
        if ( false === get_option( $this->_token.'_version' ) ){
            add_option( $this->_token.'_version', $this->_version, '', 'yes' );
        } else {
            update_option( $this->_token . '_version', $this->_version );
        }

        // footer cart settings array
        $cart_settings = array();
        $cart_settings['status'] = true;
        $cart_settings['bottom'] = '';
        $cart_settings['right'] = '';
        $cart_settings['bgColor'] = '';
        $cart_settings['borderColor'] = '';
        $cart_settings['borderWidth'] = '';
        $cart_settings['borderRadius'] = '';
        $cart_settings['fontColor'] = '';
        $cart_settings['fontSize'] = '';
        $cart_settings['width'] = '';

        // general label settings array
        $label_settings = array();
        $label_settings['prdNotFound'] = __( 'Products not found', 'product-table-for-woocommerce' );
        $label_settings['cartWidgetSingleItem'] = __( 'Item', 'product-table-for-woocommerce' );
        $label_settings['cartWidgetMultiItems'] = __( 'Items', 'product-table-for-woocommerce' );
        $label_settings['cartWidgetView'] = __( 'View Cart', 'product-table-for-woocommerce' );

        // gen settings combined array
        $gen_settings = array();
        $gen_settings['cart'] = $cart_settings;
        $gen_settings['labels'] = $label_settings;
        
        // adding general settings options
        if ( false === get_option( 'awcpt_general_settings' ) ){
            add_option( 'awcpt_general_settings', maybe_serialize( $gen_settings ), '', 'yes' );
        }
    }

    /**
     * Adding post types
    */
    public function awcpt_post_types()
    {
        if( !post_type_exists( 'aco_product_table' ) ) {
            register_post_type( 'aco_product_table',
                array(
                    'labels' => array(
                        'name' => __( 'Product Tables', 'product-table-for-woocommerce' ),
                        'singular_name' => __( 'Product Table', 'product-table-for-woocommerce' ),
                        'menu_name' => __( 'Woo Product Table By Acowebs', 'product-table-for-woocommerce' ),
                    ),
                    'public' => true,
                    'show_ui' => false,
                    'has_archive' => false,
                    'menu_icon' => 'dashicons-editor-justify',
                    'rewrite' => array('slug' => 'product-table'),
                    'capability_type' => 'post',
                    'map_meta_cap' => true,
                    'supports'=> array('title'),
                    'hierarchical' => false,
                    'show_in_nav_menus' => false,
                    'publicly_queryable' => false,
                    'exclude_from_search' => true,
                    'can_export' => true
                )
            );
        }
    }

    /**
     * Creating admin pages
    */
    public function register_root_page()
    {
        $this->hook_suffix[] = add_menu_page(
            __( 'WC Product Tables', 'product-table-for-woocommerce' ),
            __( 'WC Product Tables', 'product-table-for-woocommerce' ),
            'manage_woocommerce',
            AWCPT_TOKEN.'_admin_ui',
            array( $this, 'admin_ui' ),
            $this->assets_url.'/images/menu-icon.png',
            25
        );
    }

    /**
     * Calling view function for admin page components
    */
    public function admin_ui()
    {
        AWCPT_Backend::view('admin-root', []);
    }

    /**
     * Adding new link(Configure) in plugin listing page section
    */
    public function add_settings_link($links)
    {
        $settings = '<a href="' . admin_url( 'admin.php?page='.AWCPT_TOKEN.'_admin_ui#/' ) . '">' . __( 'Configure', 'product-table-for-woocommerce' ) . '</a>';
        array_push( $links, $settings );
        return $links;
    }

    /**
     * Including View templates
    */
    static function view( $view, $data = array() )
    {
        //extract( $data );
        include( plugin_dir_path(__FILE__) . 'views/' . $view . '.php' );
    }

    /**
     * Load admin CSS.
     * @access  public
     * @return  void
     * @since   1.0.0
     */
    public function admin_enqueue_styles($hook = '')
    {
        wp_register_style($this->_token . '-admin', esc_url($this->assets_url) . 'css/backend.css', array(), $this->_version);
        wp_enqueue_style($this->_token . '-admin');
    }

    /**
     * Load admin Javascript.
     * @access  public
     * @return  void
     * @since   1.0.0
    */
    public function admin_enqueue_scripts($hook = '')
    {
        if (!isset($this->hook_suffix) || empty($this->hook_suffix)) {
            return;
        }

        $screen = get_current_screen();

        wp_enqueue_script('jquery');

        // deactivation form js
        if ( $screen->id == 'plugins' ) {
            wp_enqueue_script( 'wp-deactivation-message', esc_url( $this->assets_url ). 'js/message.js', array() );
        }

        if ( in_array( $screen->id, $this->hook_suffix ) ) {
            // Enqueue WordPress media scripts
            if ( !did_action( 'wp_enqueue_media' ) ) {
                wp_enqueue_media();
            }

            // transilation script
            if ( !wp_script_is( 'wp-i18n', 'registered' ) ) {
                wp_register_script( 'wp-i18n', esc_url( $this->assets_url ) . 'js/i18n.min.js', array('jquery'), $this->_version, true );
            }
            wp_enqueue_script( $this->_token . '-backend', esc_url( $this->assets_url ) . 'js/backend.js', array('wp-i18n'), $this->_version, true );
            wp_localize_script( $this->_token . '-backend', 'awcpt_object', array(
                    'api_nonce' => wp_create_nonce('wp_rest'),
                    'root' => rest_url('awcpt/v1/'),
                    'text_domain' => 'product-table-for-woocommerce'
                )
            );

            // backend js transilations
            if( AWCPT_WP_VERSION >= 5 ) {
                $plugin_lang_path = trailingslashit( $this->dir ) . 'languages';
                wp_set_script_translations( $this->_token . '-backend', 'product-table-for-woocommerce' );
            }
        }
    }

    /**
     * Deactivation form
    */
    public function aco_deactivation_form()
    {
        $currentScreen = get_current_screen();
        $screenID = $currentScreen->id;
        if ( $screenID == 'plugins' ) {
            $view = '<div id="awcpt-survey-form-wrap"><div id="awcpt-survey-form">
            <p>If you have a moment, please let us know why you are deactivating this plugin. All submissions are anonymous and we only use this feedback for improving our plugin.</p>
            <form method="POST">
                <input name="Plugin" type="hidden" placeholder="Plugin" value="'.AWCPT_TOKEN.'" required>
                <input name="Version" type="hidden" placeholder="Version" value="'.AWCPT_VERSION.'" required>
                <input name="Date" type="hidden" placeholder="Date" value="'.date("m/d/Y").'" required>
                <input name="Website" type="hidden" placeholder="Website" value="'.get_site_url().'" required>
                <input name="Title" type="hidden" placeholder="Title" value="'.get_bloginfo( 'name' ).'" required>
                <input type="radio" id="temporarily" name="Reason" value="I\'m only deactivating temporarily">
                <label for="temporarily">I\'m only deactivating temporarily</label><br>
                <input type="radio" id="notneeded" name="Reason" value="I no longer need the plugin">
                <label for="notneeded">I no longer need the plugin</label><br>
                <input type="radio" id="short" name="Reason" value="I only needed the plugin for a short period">
                <label for="short">I only needed the plugin for a short period</label><br>
                <input type="radio" id="better" name="Reason" value="I found a better plugin">
                <label for="better">I found a better plugin</label><br>
                <input type="radio" id="upgrade" name="Reason" value="Upgrading to PRO version">
                <label for="upgrade">Upgrading to PRO version</label><br>
                <input type="radio" id="requirement" name="Reason" value="Plugin doesn\'t meets my requirement">
                <label for="requirement">Plugin doesn\'t meets my requirement</label><br>
                <input type="radio" id="broke" name="Reason" value="Plugin broke my site">
                <label for="broke">Plugin broke my site</label><br>
                <input type="radio" id="stopped" name="Reason" value="Plugin suddenly stopped working">
                <label for="stopped">Plugin suddenly stopped working</label><br>
                <input type="radio" id="bug" name="Reason" value="I found a bug">
                <label for="bug">I found a bug</label><br>
                <input type="radio" id="other" name="Reason" value="Other">
                <label for="other">Other</label><br>
                <p id="aco-error"></p>
                <div class="aco-comments" style="display:none;">
                    <textarea type="text" name="Comments" placeholder="Please specify" rows="2"></textarea>
                    <p>For support queries <a href="https://support.acowebs.com/portal/en/newticket?departmentId=361181000000006907&layoutId=361181000000074011" target="_blank">Submit Ticket</a></p>
                </div>
                <button type="submit" class="aco_button" id="awcpt_deactivate">Submit & Deactivate</button>
                <a href="#" class="aco_button" id="aco_cancel">Cancel</button>
                <a href="#" class="aco_button" id="aco_skip">Skip & Deactivate</button>
            </form></div></div>';
            echo $view;
        } ?>
        <style>
            #awcpt-survey-form-wrap{ display: none;position: absolute;top: 0px;bottom: 0px;left: 0px;right: 0px;z-index: 10000;background: rgb(0 0 0 / 63%); } #awcpt-survey-form{ display:none;margin-top: 15px;position: fixed;text-align: left;width: 40%;max-width: 600px;z-index: 100;top: 50%;left: 50%;transform: translate(-50%, -50%);background: rgba(255,255,255,1);padding: 35px;border-radius: 6px;border: 2px solid #fff;font-size: 14px;line-height: 24px;outline: none;}#awcpt-survey-form p{font-size: 14px;line-height: 24px;padding-bottom:20px;margin: 0;} #awcpt-survey-form .aco_button { margin: 25px 5px 10px 0px; height: 42px;border-radius: 6px;background-color: #1eb5ff;border: none;padding: 0 36px;color: #fff;outline: none;cursor: pointer;font-size: 15px;font-weight: 600;letter-spacing: 0.1px;color: #ffffff;margin-left: 0 !important;position: relative;display: inline-block;text-decoration: none;line-height: 42px;} #awcpt-survey-form .aco_button#awcpt_deactivate{background: #fff;border: solid 1px rgba(88,115,149,0.5);color: #a3b2c5;} #awcpt-survey-form .aco_button#aco_skip{background: #fff;border: none;color: #a3b2c5;padding: 0px 15px;float:right;}#awcpt-survey-form .aco-comments{position: relative;}#awcpt-survey-form .aco-comments p{ position: absolute; top: -24px; right: 0px; font-size: 14px; padding: 0px; margin: 0px;} #awcpt-survey-form .aco-comments p a{text-decoration:none;}#awcpt-survey-form .aco-comments textarea{background: #fff;border: solid 1px rgba(88,115,149,0.5);width: 100%;line-height: 30px;resize:none;margin: 10px 0 0 0;} #awcpt-survey-form p#aco-error{margin-top: 10px;padding: 0px;font-size: 13px;color: #ea6464;}
        </style>
    <?php }

    /**
     * Cloning is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }

    /**
     * Unserializing instances of this class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup()
    {
        _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }
}