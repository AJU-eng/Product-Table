<?php

if (!defined('ABSPATH'))
	exit;

class AWCPT_Front_End
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
	 * The plugin assets URL.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $assets_url;

	/**
	 * The plugin templates directory.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $templates_dir;

	/**
	 * The plugin filters directory.
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $filters_dir;

	/**
	 * The plugin general settings
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $general_settings;

	/**
	 * The table columns
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $table_cols;

	/**
	 * The table design codes
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $gen_labels;

	/**
	 * The table design codes
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $table_design;

	/**
	 * Table configuration data
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $tbl_config;

	/**
	 * Table nav filters
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $tbl_nav;

	/**
	 * Table id for custom styles
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $tbl_id;

	/**
	 * Constructor function.
	 * @access  public
	 * @return  void
	 * @since   1.0.0
	 */
	function __construct($file = '', $version = '1.0.0')
	{
		$this->_version = $version;
		$this->_token = AWCPT_TOKEN;
		$this->file = $file;
		$this->dir = dirname($this->file);
		$this->assets_dir = trailingslashit($this->dir) . 'assets';
		$this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));
		$this->templates_dir = trailingslashit($this->dir) . 'templates';
		$this->filters_dir = trailingslashit($this->dir) . 'filters';
		// general settings
		$gen_settings_serialize = get_option('awcpt_general_settings');
		if ($gen_settings_serialize) {
			$this->general_settings = maybe_unserialize($gen_settings_serialize);
		}

		/**
		 * Check if WooCommerce is active* 
		 */
		if ($this->check_woocommerce_active()) {
			// front end scripts
			add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_scripts'), 15);
			// front end styles
			add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_styles'), 10, 1);
			// shortcode
			add_shortcode('aco_product_table', array($this, 'awcpt_shortcode'));
			//add to cart ajax
			add_action('wp_ajax_awcpt_add_to_cart', array($this, 'awcpt_add_to_cart'));
			add_action('wp_ajax_nopriv_awcpt_add_to_cart', array($this, 'awcpt_add_to_cart'));
			// add all to cart ajax
			add_action('wp_ajax_awcpt_add_all_to_cart', array($this, 'awcpt_add_all_to_cart'));
			add_action('wp_ajax_nopriv_awcpt_add_all_to_cart', array($this, 'awcpt_add_all_to_cart'));
			// table filter ajax
			add_action('wp_ajax_awcpt_filter', array($this, 'awcpt_filter'));
			add_action('wp_ajax_nopriv_awcpt_filter', array($this, 'awcpt_filter'));
			// footer cart widget hook to footer
			if (!empty($this->general_settings['cart']['status'])) {
				add_action('wp_footer', array($this, 'awcpt_cart_widget'));
			}
			//  Additional awcpt fragments hook for Footer cart widget
			if (!empty($this->general_settings['cart']['status'])) {
				add_filter('woocommerce_add_to_cart_fragments', array($this, 'wcpt_add_to_cart_fragments'), 10, 1);
			}
		}
	}

	/**
	 * Checking woocommerce installed.
	 * @access  public
	 * @return  boolean
	 * @since   1.0.0
	 */
	public function check_woocommerce_active()
	{
		if (in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')))) {
			return true;
		}
		if (is_multisite()) {
			$plugins = get_site_option('active_sitewide_plugins');
			if (isset($plugins['woocommerce/woocommerce.php']))
				return true;
		}
		return false;
	}

	/**
	 * Ensures only one instance of APIFW_Front_End is loaded or can be loaded.
	 * @return Main APIFW_Front_End instance
	 * @since 1.0.0
	 * @static
	 */
	public static function instance($parent)
	{
		if (is_null(self::$_instance)) {
			self::$_instance = new self($parent);
		}
		return self::$_instance;
	}

	/**
	 * Enqueue front end scripts
	 * @access  public
	 * @since   1.0.0
	 */
	public function frontend_enqueue_scripts()
	{
		wp_register_script($this->_token . '-frontend', esc_url($this->assets_url) . 'js/frontend-min.js', array('jquery'), $this->_version, true);
		wp_enqueue_script('wc-add-to-cart-variation');
		wp_localize_script($this->_token . '-frontend', 'awcpt_frontend_object', array(
			'ajaxurl' => admin_url('admin-ajax.php'),
			'asseturl' => $this->assets_url
		));
	}

	/**
	 * Enqueue front end css
	 * @access  public
	 * @since   1.0.0
	 */
	public function frontend_enqueue_styles($hook = '')
	{
		wp_register_style($this->_token . '-frontend', esc_url($this->assets_url) . 'css/frontend-min.css', array(), $this->_version);
		wp_enqueue_style($this->_token . '-frontend');
	}


	/**
	 * If attributes is present
	 * @access public
	 * @since 1.0.0
	 */

	public function awcpt_attr_active($awcpt_data_serialized)
	{
		$awcpt_data = maybe_unserialize($awcpt_data_serialized);
		if ($awcpt_data) {
			$this->table_cols = $awcpt_data['columns'];
			$this->table_design = $awcpt_data['design'];
			$responsive_mode = $this->table_design['responsive_mode'];

			// table custom styles
			$tbl_head_styles = $this->table_design['head'];
			$tbl_body_styles = $this->table_design['body'];
			$btn_styles = $this->table_design['button'];
			$pagination_styles = $this->table_design['pagination'];
			$custom_css = $this->table_design['custom_css'];
			$style = '<style>';

			// table head styles
			$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > thead > tr > th {';
			$style .= 'background-color: ' . $tbl_head_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $tbl_head_styles['borderColor'] . '; ';
			$style .= 'color: ' . $tbl_head_styles['color'] . '; ';
			$style .= 'border-top-width: ' . $tbl_head_styles['borderTopWidth'] . 'px; ';
			$style .= 'border-right-width: ' . $tbl_head_styles['borderRightWidth'] . 'px; ';
			$style .= 'border-bottom-width: ' . $tbl_head_styles['borderBottomWidth'] . 'px; ';
			$style .= 'border-left-width: ' . $tbl_head_styles['borderLeftWidth'] . 'px; ';
			$style .= 'border-style: ' . $tbl_head_styles['borderStyle'] . '; ';
			$style .= 'text-align: ' . $tbl_head_styles['textAlign'] . '; ';
			if (isset($tbl_head_styles['padding']) && $tbl_head_styles['padding'] != '') {
				$style .= 'padding: ' . $tbl_head_styles['padding'] . ';';
			}
			$style .= '}';
			if ($tbl_head_styles['borderLeftWidth'] > 0) {
				$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > thead > tr > th:last-child {';
				$style .= 'border-right-width: ' . $tbl_head_styles['borderLeftWidth'] . 'px; ';
				$style .= '}';
			}
			if ($tbl_head_styles['borderRightWidth'] > 0) {
				$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > thead > tr > th:first-child {';
				$style .= 'border-left-width: ' . $tbl_head_styles['borderRightWidth'] . 'px; ';
				$style .= '}';
			}

			// table body styles
			$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > tbody > tr > td {';
			$style .= 'background-color: ' . $tbl_body_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $tbl_body_styles['borderColor'] . '; ';
			$style .= 'color: ' . $tbl_body_styles['color'] . '; ';
			$style .= 'border-top-width: ' . $tbl_body_styles['borderTopWidth'] . 'px; ';
			$style .= 'border-right-width: ' . $tbl_body_styles['borderRightWidth'] . 'px; ';
			$style .= 'border-bottom-width: ' . $tbl_body_styles['borderBottomWidth'] . 'px; ';
			$style .= 'border-left-width: ' . $tbl_body_styles['borderLeftWidth'] . 'px; ';
			$style .= 'border-style: ' . $tbl_body_styles['borderStyle'] . '; ';
			$style .= 'text-align: ' . $tbl_body_styles['textAlign'] . '; ';
			if (isset($tbl_body_styles['padding']) && $tbl_body_styles['padding'] != '') {
				$style .= 'padding: ' . $tbl_body_styles['padding'] . ';';
			}
			$style .= '}';
			if ($tbl_body_styles['borderLeftWidth'] > 0) {
				$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > tbody > tr > td:last-child {';
				$style .= 'border-right-width: ' . $tbl_body_styles['borderLeftWidth'] . 'px; ';
				$style .= '}';
			}
			if ($tbl_body_styles['borderRightWidth'] > 0) {
				$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' > tbody > tr > td:first-child {';
				$style .= 'border-left-width: ' . $tbl_body_styles['borderRightWidth'] . 'px; ';
				$style .= '}';
			}

			// button styles
			$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-button, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-woo-btn .button, table#awcpt-product-table-' . $this->tbl_id . ' .single_add_to_cart_button {';
			$style .= 'background-color: ' . $btn_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['borderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['color'] . '; ';
			$style .= 'border-width: ' . $btn_styles['borderWidth'] . 'px; ';
			$style .= 'border-style: ' . $btn_styles['borderStyle'] . '; ';
			$style .= 'border-radius: ' . $btn_styles['borderRadius'] . 'px; ';
			$style .= 'font-size: ' . $btn_styles['fontSize'] . 'px; ';
			$style .= 'text-align: ' . $btn_styles['textAlign'] . '; ';
			if (isset($btn_styles['padding']) && $btn_styles['padding'] != '') {
				$style .= 'padding: ' . $btn_styles['padding'] . ';';
			}
			$style .= '}';

			// Button hover styles
			$style .= 'table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-button:hover, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-button:active, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-button:focus, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-woo-btn .button:hover, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-woo-btn .button:active, table#awcpt-product-table-' . $this->tbl_id . ' .awcpt-woo-btn .button:focus, table#awcpt-product-table-' . $this->tbl_id . ' .single_add_to_cart_button:hover, table#awcpt-product-table-' . $this->tbl_id . ' .single_add_to_cart_button:active, table#awcpt-product-table-' . $this->tbl_id . ' .single_add_to_cart_button:focus {';
			$style .= 'background-color: ' . $btn_styles['hoverBgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['hoverBorderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['hoverColor'] . '; ';
			$style .= '}';

			// add all to cart button styles
			$style .= '.add-to-cart-all-' . $this->tbl_id . ' {';
			$style .= 'background-color: ' . $btn_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['borderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['color'] . '; ';
			$style .= 'border-width: ' . $btn_styles['borderWidth'] . 'px; ';
			$style .= 'border-style: ' . $btn_styles['borderStyle'] . '; ';
			$style .= 'border-radius: ' . $btn_styles['borderRadius'] . 'px; ';
			$style .= 'font-size: 13px; ';
			$style .= 'text-align: ' . $btn_styles['textAlign'] . '; ';
			$style .= '}';

			// add all to cart btn hover styles
			$style .= '.add-to-cart-all-' . $this->tbl_id . ':hover, .add-to-cart-all-' . $this->tbl_id . ':active, .add-to-cart-all-' . $this->tbl_id . ':focus {';
			$style .= 'background-color: ' . $btn_styles['hoverBgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['hoverBorderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['hoverColor'] . '; ';
			$style .= '}';

			// loadmore button styles
			$style .= '.awcpt-loadmore-btn-' . $this->tbl_id . ' {';
			$style .= 'background-color: ' . $btn_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['borderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['color'] . '; ';
			$style .= 'border-width: ' . $btn_styles['borderWidth'] . 'px; ';
			$style .= 'border-style: ' . $btn_styles['borderStyle'] . '; ';
			$style .= 'border-radius: ' . $btn_styles['borderRadius'] . 'px; ';
			$style .= 'font-size: ' . $btn_styles['fontSize'] . 'px; ';
			$style .= 'text-align: ' . $btn_styles['textAlign'] . '; ';
			if (isset($btn_styles['padding']) && $btn_styles['padding'] != '') {
				$style .= 'padding: ' . $btn_styles['padding'] . ';';
			}
			$style .= '}';

			// loadmore btn hover styles
			$style .= '.awcpt-loadmore-btn-' . $this->tbl_id . ':hover, .awcpt-loadmore-btn-' . $this->tbl_id . ':active, .awcpt-loadmore-btn-' . $this->tbl_id . ':focus {';
			$style .= 'background-color: ' . $btn_styles['hoverBgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['hoverBorderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['hoverColor'] . '; ';
			$style .= '}';

			// Search button styles
			$style .= 'input[type="submit"].awcpt-search-submit-' . $this->tbl_id . ' {';
			$style .= 'background-color: ' . $btn_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['borderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['color'] . '; ';
			$style .= 'border-width: ' . $btn_styles['borderWidth'] . 'px; ';
			$style .= 'border-style: ' . $btn_styles['borderStyle'] . '; ';
			$style .= 'text-align: ' . $btn_styles['textAlign'] . '; ';
			$style .= '}';

			// Search btn hover styles
			$style .= '.awcpt-search-submit-' . $this->tbl_id . ':hover, .awcpt-search-submit-' . $this->tbl_id . ':active, .awcpt-search-submit-' . $this->tbl_id . ':focus {';
			$style .= 'background-color: ' . $btn_styles['hoverBgColor'] . '; ';
			$style .= 'border-color: ' . $btn_styles['hoverBorderColor'] . '; ';
			$style .= 'color: ' . $btn_styles['hoverColor'] . '; ';
			$style .= '}';

			// pagination styles
			$style .= '.awcpt-pagination-' . $this->tbl_id . ' .page-numbers {';
			$style .= 'background-color: ' . $pagination_styles['bgColor'] . '; ';
			$style .= 'border-color: ' . $pagination_styles['borderColor'] . '; ';
			$style .= 'color: ' . $pagination_styles['color'] . '; ';
			$style .= 'border-width: ' . $pagination_styles['borderWidth'] . 'px; ';
			$style .= 'border-style: ' . $pagination_styles['borderStyle'] . '; ';
			$style .= 'border-radius: ' . $pagination_styles['borderRadius'] . 'px; ';
			$style .= 'font-size: ' . $pagination_styles['fontSize'] . 'px; ';
			$style .= 'text-align: ' . $pagination_styles['textAlign'] . '; ';
			if (isset($pagination_styles['padding']) && $pagination_styles['padding'] != '') {
				$style .= 'padding: ' . $pagination_styles['padding'] . ';';
			}
			$style .= '}';

			// pagination active styles
			$style .= '.awcpt-pagination-' . $this->tbl_id . ' .page-numbers.current {';
			$style .= 'background-color: ' . $pagination_styles['activeBgColor'] . '; ';
			$style .= 'border-color: ' . $pagination_styles['activeBorderColor'] . '; ';
			$style .= 'color: ' . $pagination_styles['activeColor'] . '; ';
			$style .= '}';

			// pagination hover styles
			$style .= '.awcpt-pagination-' . $this->tbl_id . ' .page-numbers:hover {';
			$style .= 'background-color: ' . $pagination_styles['hoverBgColor'] . '; ';
			$style .= 'border-color: ' . $pagination_styles['hoverBorderColor'] . '; ';
			$style .= 'color: ' . $pagination_styles['hoverColor'] . '; ';
			$style .= '}';

			// custom css
			if ($custom_css) {
				$style .= $custom_css;
			}
			$style .= '</style>';

			echo $style;
		}
	}

	/**
	 * Add shortcode
	 * @access  public
	 * @since   1.0.0
	 */
	public function awcpt_shortcode($atts)
	{
		wp_enqueue_script($this->_token . '-frontend');
		ob_start();
		// general settings
		if ($this->general_settings) {
			$this->gen_labels = $this->general_settings['labels'];
		}
         
		// Attributes
		$atts = shortcode_atts(
			array(
				'id' => '',
			),
			$atts
		);

		// main query and settings
		if ($atts['id']) {
			$table_id = $atts['id'];
			$this->tbl_id = $table_id;
			$awcpt_data_serialized = get_post_meta($table_id, 'awcpt_data', true);
			$awcpt_query_serialized = get_post_meta($table_id, 'awcpt_query', true);

			echo '<div class="awcpt-wrapper" data-table-id="' . $table_id . '">';

			if ($awcpt_data_serialized) {
				$this->awcpt_attr_active($awcpt_data_serialized);
			}

			if ($awcpt_query_serialized) {
				$this->awcpt_query_serialized($awcpt_query_serialized, $table_id);
			}

			echo '</div>';
		}

		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}





	/**
	 * if query is serialized
	 * @access public
	 * @since 1.0.0
	 */

	public function awcpt_query_serialized($awcpt_query_serialized, $table_id)
	{
		$awcpt_query = maybe_unserialize($awcpt_query_serialized);
		$this->tbl_config = $awcpt_query['config'];
		$this->tbl_nav = $awcpt_query['navigation'];
		$products_per_page = -1;
		$order = '';
		$order_by = '';
		$search_target = '';
		if ($this->tbl_config) {
			$prd_types = $this->tbl_config['types'];
			$prd_visibility = $this->tbl_config['visibility'];
			$cat_in = $this->tbl_config['cats'];
			$tag_in = $this->tbl_config['tags'];
			$prd_ids = $this->tbl_config['prd_ids'];
			$prd_skus = $this->tbl_config['skus'];
			$cat_exclude = $this->tbl_config['exclude_cats'];
			$tag_exclude = $this->tbl_config['exclude_tags'];
			$prd_ids_exclude = $this->tbl_config['exclude_prd_ids'];
			$order = $this->tbl_config['order'];
			$order_by = $this->tbl_config['order_by'];
			$order_meta_key = $this->tbl_config['order_meta_key'];
			$min_price = $this->tbl_config['min_price'];
			$max_price = $this->tbl_config['max_price'];
			$only_in_stock = $this->tbl_config['only_stock'];
			$only_onsale = $this->tbl_config['only_sale'];
			$products_per_page = $this->tbl_config['products_per_page'];
			$search_target = $this->tbl_config['search_target_fields'];
			$pagination_status = $this->tbl_config['pagination'];
			$ajax_pagination_status = $this->tbl_config['ajax_pagination'];
			$load_more_btn_status = $this->tbl_config['load_more'];
			$load_more_btn_txt = $this->tbl_config['load_more_txt'];
			$add_all_to_cart_status = $this->tbl_config['add_all_to_cart'];
			$add_all_to_cart_txt = $this->tbl_config['add_all_to_cart_txt'];
			$table_class = $this->tbl_config['table_class'];
			$show_table_head = $this->tbl_config['show_table_head'];
			$table_width = isset($this->tbl_config['table_width']) ? $this->tbl_config['table_width'] : '';
		}

		// table custom width style
		$tbl_style = '';
		if (!empty($table_width)) {
			$tbl_style = 'style="';
			$tbl_style .= 'width:' . $table_width . 'px;';
			$tbl_style .= '"';
		}

		if ($this->tbl_nav) {
			$nav_sidebar_elems = $this->tbl_nav['sidbar_elems'];
			$nav_head_left_elems = $this->tbl_nav['head_left_elems'];
			$nav_head_right_elems = $this->tbl_nav['head_right_elems'];
			$nav_layout = $this->tbl_nav['head_layout'];
		}

		if ($this->table_cols) {
			$paged = !empty($_GET[$table_id . '_paged']) ? sanitize_text_field($_GET[$table_id . '_paged']) : 1;
			$offset = 0;
			$search_ids = array();
			$posts_in = array();
			$sort_meta = array();

			// meta and tax query initial
			$meta_query = array(
				'relation' => 'AND',
			);
			$tax_query = array(
				'relation' => 'AND',
			);

			// product type
			if ($prd_types) {
				$prd_type_filter = array(
					'taxonomy' => 'product_type',
					'field' => 'term_id',
					'terms' => $prd_types,
				);
				array_push($tax_query, $prd_type_filter);
			}

			// product visibility
			if ($prd_visibility) {
				$prd_visibility_filter = array(
					'taxonomy' => 'product_visibility',
					'field' => 'term_id',
					'terms' => $prd_visibility,
				);
				array_push($tax_query, $prd_visibility_filter);
			}

			// tags in filter
			if ($tag_in) {
				$tag_in_filter = array(
					'taxonomy' => 'product_tag',
					'field' => 'term_id',
					'terms' => $tag_in,
				);
				array_push($tax_query, $tag_in_filter);
			}

			// sku filter
			if ($prd_skus) {
				$sku_array = explode(",", $prd_skus);
				$sku_filter = array(
					'key' => '_sku',
					'value' => $sku_array,
					'compare' => 'IN',
				);
				array_push($meta_query, $sku_filter);
			}

			// cat exclude filter
			if ($cat_exclude) {
				$cat_exclude_filter = array(
					'taxonomy' => 'product_cat',
					'field' => 'term_id',
					'terms' => $cat_exclude,
					'operator' => 'NOT IN'
				);
				array_push($tax_query, $cat_exclude_filter);
			}

			// Tag exclude filter
			if ($tag_exclude) {
				$tag_exclude_filter = array(
					'taxonomy' => 'product_tag',
					'field' => 'term_id',
					'terms' => $tag_exclude,
					'operator' => 'NOT IN'
				);
				array_push($tax_query, $tag_exclude_filter);
			}

			// filter product ids in
			if (!empty($prd_ids)) {
				$prd_ids_array = explode(",", $prd_ids);
				$posts_in = $prd_ids_array;
			}

			// onsale filter
			if ($only_onsale) {
				$sale_product_ids = wc_get_product_ids_on_sale();
				if ($sale_product_ids) {
					if (!empty($posts_in)) {
						$sale_product_ids = array_intersect($posts_in, $sale_product_ids);
					}
					$posts_in = $sale_product_ids;
				}
			}

			// min price filter
			if ($min_price) {
				$min_price_filter = array(
					'key' => '_price',
					'value' => $min_price,
					'type' => 'NUMERIC',
					'compare' => '>='
				);
				array_push($meta_query, $min_price_filter);
			}

			// max price filter
			if ($max_price) {
				$max_price_filter = array(
					'key' => '_price',
					'value' => $max_price,
					'type' => 'NUMERIC',
					'compare' => '<='
				);
				array_push($meta_query, $max_price_filter);
			}

			// instock filter
			if ($only_in_stock) {
				$in_stock_filter = array(
					'key' => '_stock_status',
					'value' => 'instock',
					'compare' => '='
				);
				array_push($meta_query, $in_stock_filter);
			}

			// sort by meta
			if (($order_by == 'meta_value' || $order_by == 'meta_value_num') && $order_meta_key) {
				$sort_meta = array(
					'key' => $order_meta_key,
					'compare' => 'EXISTS',
				);
			}

			// sort param in url
			if (!empty($_GET[$table_id . '_order_by'])) {
				$sort_by = sanitize_text_field($_GET[$table_id . '_order_by']);
				if ($sort_by == 'popularity') {
					// sort meta
					$sort_meta = array(
						'key' => 'total_sales',
						'compare' => 'EXISTS',
					);
					// main query params
					$order = 'DESC';
					$order_by = 'meta_value_num';
				} elseif ($sort_by == 'rating') {
					// sort meta
					$sort_meta = array(
						'key' => '_wc_average_rating',
						'compare' => 'EXISTS',
					);
					// main query params
					$order = 'DESC';
					$order_by = 'meta_value_num';
				} elseif ($sort_by == 'price') {
					// sort meta
					$sort_meta = array(
						'key' => '_price',
						'compare' => 'EXISTS',
					);
					// main query params
					$order = 'ASC';
					$order_by = 'meta_value_num';
				} elseif ($sort_by == 'priceDesc') {
					// sort meta
					$sort_meta = array(
						'key' => '_price',
						'compare' => 'EXISTS',
					);
					// main query params
					$order = 'DESC';
					$order_by = 'meta_value_num';
				} elseif ($sort_by == 'date') {
					$order = 'DESC';
					$order_by = 'date';
				} elseif ($sort_by == 'title') {
					$order = 'ASC';
					$order_by = 'title';
				} elseif ($sort_by == 'titleDesc') {
					$order = 'DESC';
					$order_by = 'title';
				} elseif ($sort_by == 'menuOrder') {
					$order = 'ASC';
					$order_by = 'menu_order';
				} elseif ($sort_by == 'menuOrderDesc') {
					$order = 'DESC';
					$order_by = 'menu_order';
				} else {
					$order = 'ASC';
					$order_by = 'menu_order';
				}
			}

			// push sort by meta to meta query array
			if (!empty($sort_meta)) {
				array_push($meta_query, $sort_meta);
			}

			// products per page url param handle
			if (!empty($_GET[$table_id . '_results_per_page'])) {
				$products_per_page = sanitize_text_field($_GET[$table_id . '_results_per_page']);
			}

			// categories in url handler
			if (!empty($_GET[$table_id . '_categories']) && $_GET[$table_id . '_categories'] != 'any') {
				$cat_string = sanitize_text_field($_GET[$table_id . '_categories']);
				if ($cat_string) {
					$cat_in = array_map('intval', explode(",", $cat_string));
				}
			}

			// category in filter
			if ($cat_in) {
				$cat_in_filter = array(
					'taxonomy' => 'product_cat',
					'field' => 'term_id',
					'terms' => $cat_in,
				);
				array_push($tax_query, $cat_in_filter);
			}

			// price range param in url handler
			if (!empty($_GET[$table_id . '_price_range']) && $_GET[$table_id . '_price_range'] != 'any') {
				$price_range_str = sanitize_text_field($_GET[$table_id . '_price_range']);
				if ($price_range_str) {
					$price_range = array_map('intval', explode("-", $price_range_str));
					$price_range_filter = array(
						'key' => '_price',
						'value' => $price_range,
						'type' => 'NUMERIC',
						'compare' => 'BETWEEN'
					);
					array_push($meta_query, $price_range_filter);
				}
			}

			// Stock status param in url handler
			if (!empty($_GET[$table_id . '_stock_status']) && $_GET[$table_id . '_stock_status'] != 'any') {
				$stock_status_str = sanitize_text_field($_GET[$table_id . '_stock_status']);
				if ($stock_status_str) {
					$status_in = explode(",", $stock_status_str);
					$stock_status_filter = array(
						'key' => '_stock_status',
						'value' => $status_in,
						'compare' => 'IN'
					);
					array_push($meta_query, $stock_status_filter);
				}
			}

			// Onsale param in url handler
			if (!empty($_GET[$table_id . '_onsale']) && $_GET[$table_id . '_onsale'] != 'any') {
				$onsale_active_str = sanitize_text_field($_GET[$table_id . '_onsale']);
				if ($onsale_active_str) {
					$onsale_active = filter_var($onsale_active_str, FILTER_VALIDATE_BOOLEAN);
					if ($onsale_active) {
						$sale_product_ids = wc_get_product_ids_on_sale();
						if ($sale_product_ids) {
							if (!empty($posts_in)) {
								$sale_product_ids = array_intersect($posts_in, $sale_product_ids);
							}
							$posts_in = $sale_product_ids;
						}
					}
				}
			}

			// Rating param in url handler
			if (!empty($_GET[$table_id . '_rated']) && $_GET[$table_id . '_rated'] != 'any') {
				$rated_str = sanitize_text_field($_GET[$table_id . '_rated']);
				if ($rated_str) {
					$rated = array_map('intval', explode(",", $rated_str));
					if (count($rated) > 1) {
						$min_rate = min($rated);
						$max_rate = max($rated);
					} else {
						$min_rate = $rated[0];
						$max_rate = ($min_rate + 1) - 0.001;
					}

					$rating_filter = array(
						'key' => '_wc_average_rating',
						'value' => array($min_rate, $max_rate),
						'type' => 'DECIMAL',
						'compare' => 'BETWEEN'
					);
					array_push($meta_query, $rating_filter);
				}
			}

			// Search param in url handler
			if (!empty($_GET[$table_id . '_search'])) {
				$search_term = sanitize_text_field($_GET[$table_id . '_search']);
				if ($search_term) {
					if (!empty($search_target)) {
						global $wpdb;
						// Search by title
						if (in_array("title", $search_target)) {
							$query = "
								SELECT ID 
								FROM $wpdb->posts 
								WHERE $wpdb->posts.post_type = 'product' 
								AND post_title LIKE '%$search_term%'
							";

							$s_result = $wpdb->get_col($query);

							if (!empty($s_result)) {
								$search_ids = array_unique(array_merge($search_ids, $s_result));
							}
						}

						// Search by content
						if (in_array("content", $search_target)) {
							$query = "
								SELECT ID 
								FROM $wpdb->posts 
								WHERE $wpdb->posts.post_type = 'product' 
								AND post_content LIKE '%$search_term%'
							";

							$s_result = $wpdb->get_col($query);

							if (!empty($s_result)) {
								$search_ids = array_unique(array_merge($search_ids, $s_result));
							}
						}

						// Search by excerpt
						if (in_array("excerpt", $search_target)) {
							$query = "
								SELECT ID 
								FROM $wpdb->posts 
								WHERE $wpdb->posts.post_type = 'product' 
								AND post_excerpt LIKE '%$search_term%'
							";

							$s_result = $wpdb->get_col($query);

							if (!empty($s_result)) {
								$search_ids = array_unique(array_merge($search_ids, $s_result));
							}
						}
					}
				}
			}

			// Combining search result ids and other product ids
			if (!empty($search_ids)) {
				if (!empty($posts_in)) {
					$posts_in = array_intersect($posts_in, $search_ids);
				} else {
					$posts_in = $search_ids;
				}
			}

			// main query arguments
			$args = array(
				'post_type' => array('product'), // 'product_variation','product'
				'post_status' => 'publish',
				'meta_query' => $meta_query,
				'tax_query' => $tax_query,
				'posts_per_page' => $products_per_page,
			);

			// post in main query param
			if (!empty($posts_in)) {
				$args['post__in'] = $posts_in;
			}

			// filter exclude product ids
			if (!empty($prd_ids_exclude)) {
				$prd_ids_array = explode(",", $prd_ids_exclude);
				$args['post__not_in'] = $prd_ids_array;
			}

			// sorting main query order param
			if (!empty($order)) {
				$args['order'] = $order;
			}

			// sorting main query order by param
			if (!empty($order_by) && $order_by != 'none') {
				$args['orderby'] = $order_by;
			}

			// pagination parameter
			if ($pagination_status) {
				$args['paged'] = $paged;
			}

			// serial no start
			$serial_no = (($paged - 1) * $products_per_page) + 1;

			// main query wp_query
			$products_query = new WP_Query($args);

			// container class
			$contianer_class = 'awcpt-container';

			// left nav
			if (!empty($nav_sidebar_elems)) {
				include($this->templates_dir . '/leftside-filters.php');
			} else {
				$contianer_class .= ' awcpt-container-fullwidth';
			}

			echo '<div class="' . $contianer_class . '">';
			// head nav
			if (!empty($nav_head_left_elems) || !empty($nav_head_right_elems)) {
				include($this->templates_dir . '/head-filters.php');
			}


			// add to cart all btn
			if (!empty($add_all_to_cart_status)) {
				include($this->templates_dir . '/add-to-cart-all.php');
			}

			// pagination status text
			$pagination_sts_txt = $pagination_status ? 'on' : 'off';

			// pagination ajax status text
			$ajax_pagination_sts_txt = $ajax_pagination_status ? 'on' : 'off';

			// loadmore status text
			$load_more_sts_txt = ($load_more_btn_status && !$pagination_status) ? 'on' : 'off';

			// table contents
			echo '<div class="awcpt-table-wrapper">';
			echo '<table class="awcpt-product-table ' . $table_class . '" id="awcpt-product-table-' . $table_id . '" data-pagination="' . $pagination_sts_txt . '" data-ajax-pagination="' . $ajax_pagination_sts_txt . '" data-loadmore="' . $load_more_sts_txt . '" ' . $tbl_style . '>';
			if ($show_table_head) {
				include($this->templates_dir . '/table-head.php');
			}
			echo '<tbody>';
			// product loop
			if ($products_query->have_posts()) {
				while ($products_query->have_posts()):
					$products_query->the_post();
					global $product;
					include($this->templates_dir . '/table-body.php');
					$serial_no++;
				endwhile;
			}
			echo '</tbody>';
			echo '</table>';
			echo '</div>';

			if ($products_query->have_posts()) {
				if ($pagination_status) {
					$current_page = $paged;
					echo '<div class="awcpt-pagination-wrap">';
					include($this->templates_dir . '/pagination.php');
					echo '</div>';
				}

				if ($load_more_btn_status && !$pagination_status) {
					include($this->templates_dir . '/loadmore-button.php');
				}
			} else {
				echo '<p class="awcpt-product-found-msg">' . __($this->gen_labels['prdNotFound'], 'product-table-for-woocommerce') . '</p>';
			}
			wp_reset_postdata();

			include($this->templates_dir . '/loader.php');
			echo '</div>';
		}
	}


	/**
	 * Add to cart ajax callback 
	 * @access  public
	 * @since   1.0.0
	 */
	public function awcpt_add_to_cart()
	{
		$product_id = sanitize_text_field($_POST['product_id']);
		$quantity = sanitize_text_field($_POST['quantity']);
		$passed_validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
		if ($passed_validation && WC()->cart->add_to_cart($product_id, $quantity)) {
			do_action('woocommerce_ajax_added_to_cart', $product_id);
			WC_AJAX::get_refreshed_fragments();
		} else {
			$data = array(
				'error' => true,
				'product_url' => apply_filters('woocommerce_cart_redirect_after_error', get_permalink($product_id), $product_id),
			);
			wp_send_json($data);
		}

		wp_die();
	}

	/**
	 * Add all to cart ajax callback 
	 * @access  public
	 * @since   1.0.0
	 */
	public function awcpt_add_all_to_cart()
	{
		$cart_data = map_deep($_POST['cart_data'], 'sanitize_text_field');
		if (!empty($cart_data)) {
			$success = false;
			foreach ($cart_data as $data) {
				$product_id = $data['product_id'];
				$quantity = $data['quantity'];
				$validation = apply_filters('woocommerce_add_to_cart_validation', true, $product_id, $quantity);
				if ($validation && WC()->cart->add_to_cart($product_id, $quantity)) {
					do_action('woocommerce_ajax_added_to_cart', $product_id);
					$success = true;
				} else {
					$success = false;
				}
			}
			WC_AJAX::get_refreshed_fragments();

			if (!$success) {
				$data = array(
					'error' => true,
				);
				wp_send_json($data);
			}
		} else {
			$data = array(
				'error' => true,
			);
			wp_send_json($data);
		}

		wp_die();
	}




	/**
	 * Tbl filter callback
	 * @access  public
	 * @since   1.0.0
	 */
	public function awcpt_filter()
	{
		$table_id = sanitize_text_field( $_POST['table_id'] );
		$paged = ! empty( $_POST['page_number'] ) ? sanitize_text_field( $_POST['page_number'] ) : 1;
		$query_string = sanitize_text_field( $_POST['query_string'] );
		if( ! empty( $query_string ) ){
			$query_string_array = explode( '&', $query_string );
		} else {
			$query_string_array = array();
		}

		$products_per_page = -1;
		$search_ids = array();
		$posts_in = array();
		$order = '';
		$order_by = '';
		$sort_meta = array();
		$search_target = '';
		$offset = ( isset( $_POST['offset'] ) && $_POST['offset'] != '' ) ? sanitize_text_field( $_POST['offset'] ) : 0;
		$loadmore_click = ( isset( $_POST['loadmore_click'] ) && ! empty( sanitize_text_field( $_POST['loadmore_click'] ) ) ) ? true : false;
		// genral settings label
		$gen_labels = $this->general_settings['labels'];

		// main query arguments
		$args = array(
			'post_type' => array( 'product' ), // 'product_variation','product'
			'post_status' => 'publish',
		);
		// table config datas
		$awcpt_data_serialized = get_post_meta( $table_id, 'awcpt_data', true );
		$awcpt_query_serialized = get_post_meta( $table_id, 'awcpt_query', true );

		if( $awcpt_data_serialized ){
			$awcpt_data = maybe_unserialize( $awcpt_data_serialized );
			if( $awcpt_data ){
				$this->table_cols = $awcpt_data['columns'];
				$this->table_design = $awcpt_data['design'];
				$responsive_mode = $this->table_design['responsive_mode'];
			}
		}

		if( $awcpt_query_serialized ){
			$awcpt_query = maybe_unserialize( $awcpt_query_serialized );
			$this->tbl_config = $awcpt_query['config'];
			$this->tbl_nav = $awcpt_query['navigation'];

			if( $this->tbl_nav ){
				$nav_sidebar_elems =  $this->tbl_nav['sidbar_elems'];
				$nav_head_left_elems = $this->tbl_nav['head_left_elems'];
				$nav_head_right_elems = $this->tbl_nav['head_right_elems'];
			}

			if( $this->tbl_config ){
				$prd_types = $this->tbl_config['types'];
				$prd_visibility = $this->tbl_config['visibility'];
				$cat_in = $this->tbl_config['cats'];
				$tag_in = $this->tbl_config['tags'];
				$prd_ids = $this->tbl_config['prd_ids'];
				$prd_skus = $this->tbl_config['skus'];
				$cat_exclude = $this->tbl_config['exclude_cats'];
				$tag_exclude = $this->tbl_config['exclude_tags'];
				$prd_ids_exclude = $this->tbl_config['exclude_prd_ids'];
				$order = $this->tbl_config['order'];
				$order_by = $this->tbl_config['order_by'];
				$order_meta_key = $this->tbl_config['order_meta_key'];
				$min_price = $this->tbl_config['min_price'];
				$max_price = $this->tbl_config['max_price'];
				$only_in_stock = $this->tbl_config['only_stock'];
				$only_onsale = $this->tbl_config['only_sale'];
				$products_per_page = $this->tbl_config['products_per_page'];
				$search_target = $this->tbl_config['search_target_fields'];
				$pagination_status = $this->tbl_config['pagination'];
				$ajax_pagination_status = $this->tbl_config['ajax_pagination'];
				$load_more_btn_status = $this->tbl_config['load_more'];
				$load_more_btn_txt = $this->tbl_config['load_more_txt'];
				// $table_class = $this->tbl_config['table_class'];
				// $show_table_head = $this->tbl_config['show_table_head'];
			}

			if( $this->table_cols ){
				// meta and tax query initial
				$meta_query = array(
					'relation' => 'AND',
				);
				$tax_query = array(
					'relation' => 'AND',
				);

				// config settings 
				// product type
				if( $prd_types ){
					$prd_type_filter = array(
						'taxonomy' => 'product_type',
						'field'    => 'term_id',
						'terms'    => $prd_types,
					);
					array_push( $tax_query, $prd_type_filter );
				}

				// product visibility
				if( $prd_visibility ){
					$prd_visibility_filter = array(
						'taxonomy' => 'product_visibility',
						'field'    => 'term_id',
						'terms'    => $prd_visibility,
					);
					array_push( $tax_query, $prd_visibility_filter );
				}

				// tags in filter
				if( $tag_in ){
					$tag_in_filter = array(
						'taxonomy' => 'product_tag',
						'field'    => 'term_id',
						'terms'    => $tag_in,
					);
					array_push( $tax_query, $tag_in_filter );
				}

				// sku filter
				if( $prd_skus ){
					$sku_array = explode( ",", $prd_skus );
					$sku_filter = array(
						'key'     => '_sku',
						'value'   => $sku_array,
						'compare' => 'IN',
					);
					array_push( $meta_query, $sku_filter );
				}

				// cat exclude filter
				if( $cat_exclude ){
					$cat_exclude_filter = array(
						'taxonomy' => 'product_cat',
						'field'    => 'term_id',
						'terms'    => $cat_exclude,
						'operator' => 'NOT IN'
					);
					array_push( $tax_query, $cat_exclude_filter );
				}

				// Tag exclude filter
				if( $tag_exclude ){
					$tag_exclude_filter = array(
						'taxonomy' => 'product_tag',
						'field'    => 'term_id',
						'terms'    => $tag_exclude,
						'operator' => 'NOT IN'
					);
					array_push( $tax_query, $tag_exclude_filter );
				}

				// min price filter
				if( $min_price ){
					$min_price_filter = array(
						'key'     => '_price',
						'value'   => $min_price,
						'type' => 'NUMERIC',
						'compare' => '>='
					);
					array_push( $meta_query, $min_price_filter );
				}

				// max price filter
				if( $max_price ){
					$max_price_filter = array(
						'key'     => '_price',
						'value'   => $max_price,
						'type' => 'NUMERIC',
						'compare' => '<='
					);
					array_push( $meta_query, $max_price_filter );
				}

				// instock filter
				if( $only_in_stock ){
					$in_stock_filter = array(
						'key'     => '_stock_status',
						'value'   => 'instock',
						'compare' => '='
					);
					array_push( $meta_query, $in_stock_filter );
				}

				// sort by meta
				if( ( $order_by == 'meta_value' || $order_by == 'meta_value_num' ) && $order_meta_key ){
					$sort_meta = array(
						'key'     => $order_meta_key,
						'compare' => 'EXISTS',
					);
				}

				// filter product ids in
				if( $prd_ids ){
					$prd_ids_array = explode( ",", $prd_ids );
					$posts_in = $prd_ids_array;
				}

				// filter exclude product ids
				if( $prd_ids_exclude ){
					$prd_ids_array = explode( ",", $prd_ids_exclude );
					$args['post__not_in'] = $prd_ids_array;
				}

				// onsale filter
				if( $only_onsale ){
					$sale_product_ids = wc_get_product_ids_on_sale();
					if( $sale_product_ids ) {
						if( ! empty( $posts_in ) ){
							$sale_product_ids = array_intersect( $posts_in, $sale_product_ids );
						}
						$posts_in = $sale_product_ids;
					}
				}

				// user selected filter handle
				if( ! empty( $query_string_array ) ){
					foreach( $query_string_array as $q ){
						$param_array = explode( '=', $q );
						$param_name = $param_array[0];
						$param_val = $param_array[1];
						if( $param_name == $table_id.'_order_by' && ! empty( $param_val ) ){
							if( $param_val == 'popularity' ){
								// sort meta
								$sort_meta = array(
									'key'     => 'total_sales',
									'compare' => 'EXISTS',
								);
								// main query params
								$order = 'DESC';
								$order_by = 'meta_value_num';
							} elseif( $param_val == 'rating' ){
								// sort meta
								$sort_meta = array(
									'key'     => '_wc_average_rating',
									'compare' => 'EXISTS',
								);
								// main query params
								$order = 'DESC';
								$order_by = 'meta_value_num';
							} elseif( $param_val == 'price' ){
								// sort meta
								$sort_meta = array(
									'key'     => '_price',
									'compare' => 'EXISTS',
								);
								// main query params
								$order = 'ASC';
								$order_by = 'meta_value_num';
							} elseif( $param_val == 'priceDesc' ){
								// sort meta
								$sort_meta = array(
									'key'     => '_price',
									'compare' => 'EXISTS',
								);
								// main query params
								$order = 'DESC';
								$order_by = 'meta_value_num';
							} elseif( $param_val == 'date' ){
								$order = 'DESC';
								$order_by = 'date';
							} elseif( $param_val == 'title' ){
								$order = 'ASC';
								$order_by = 'title';
							} elseif( $param_val == 'titleDesc' ){
								$order = 'DESC';
								$order_by = 'title';
							} elseif( $param_val == 'menuOrder' ){
								$order = 'ASC';
								$order_by = 'menu_order';
							} elseif( $param_val == 'menuOrderDesc' ){
								$order = 'DESC';
								$order_by = 'menu_order';
							} else {
								$order = 'ASC';
								$order_by = 'menu_order';
							}
						} elseif( $param_name == $table_id.'_results_per_page' && ! empty( $param_val ) ){
							$products_per_page = $param_val;
						} elseif( $param_name == $table_id.'_categories' && ! empty( $param_val ) && $param_val != 'any' ){
							$cat_in = array_map( 'intval', explode( ",", $param_val ) );
						} elseif( $param_name == $table_id.'_price_range' && ! empty( $param_val ) && $param_val != 'any' ){
							$price_range = array_map( 'intval', explode( "-", $param_val ) );
							$price_range_filter = array(
								'key'     => '_price',
								'value'   => $price_range,
								'type' => 'NUMERIC',
								'compare' => 'BETWEEN'
							);
							array_push( $meta_query, $price_range_filter );
						} elseif( $param_name == $table_id.'_stock_status' && ! empty( $param_val ) && $param_val != 'any' ){
							$status_in = explode( ",", $param_val );
							$stock_status_filter = array(
								'key'     => '_stock_status',
								'value'   => $status_in,
								'compare' => 'IN'
							);
							array_push( $meta_query, $stock_status_filter );
						} elseif( $param_name == $table_id.'_onsale' && ! empty( $param_val ) && $param_val != 'any' ){
							$onsale_active = filter_var( $param_val, FILTER_VALIDATE_BOOLEAN );
							if( $onsale_active ){
								$sale_product_ids = wc_get_product_ids_on_sale();
								if( $sale_product_ids ) {
									if( ! empty( $posts_in ) ){
										$sale_product_ids = array_intersect( $posts_in, $sale_product_ids );
									}
									$posts_in = $sale_product_ids;
								}
							}
						} elseif( $param_name == $table_id.'_rated' && ! empty( $param_val ) && $param_val != 'any' ){
							$rated = array_map( 'intval', explode( ",", $param_val ) );
							if( count( $rated ) > 1 ){
								$min_rate = min( $rated );
								$max_rate = max( $rated );
							} else {
								$min_rate = $rated[0];
								$max_rate = ( $min_rate + 1 ) - 0.001;
							}

							$rating_filter = array(
								'key' => '_wc_average_rating',
								'value' => array( $min_rate, $max_rate ),
								'type' => 'DECIMAL',
								'compare' => 'BETWEEN'
							);
							array_push( $meta_query, $rating_filter );
						} elseif( $param_name == $table_id.'_search' && ! empty( $param_val ) ){
							$search_term = $param_val;

							if( ! empty( $search_target ) ) {
								global $wpdb;
								// Search by title
								if( in_array( "title", $search_target ) ){
									$query = "
										SELECT ID 
										FROM $wpdb->posts 
										WHERE $wpdb->posts.post_type = 'product' 
										AND post_title LIKE '%$search_term%'
									";
		
									$result = $wpdb->get_col( $query );
		
									if( ! empty( $result ) ){
										$search_ids = array_unique( array_merge( $search_ids, $result ) );
									}
								}
		
								// Search by content
								if( in_array( "content", $search_target ) ){
									$query = "
										SELECT ID 
										FROM $wpdb->posts 
										WHERE $wpdb->posts.post_type = 'product' 
										AND post_content LIKE '%$search_term%'
									";
		
									$result = $wpdb->get_col( $query );
		
									if( ! empty( $result ) ){
										$search_ids = array_unique( array_merge( $search_ids, $result ) );
									}
								}
		
								// Search by excerpt
								if( in_array( "excerpt", $search_target ) ){
									$query = "
										SELECT ID 
										FROM $wpdb->posts 
										WHERE $wpdb->posts.post_type = 'product' 
										AND post_excerpt LIKE '%$search_term%'
									";
		
									$result = $wpdb->get_col( $query );
		
									if( ! empty( $result ) ){
										$search_ids = array_unique( array_merge( $search_ids, $result ) );
									}
								}
							}
						} else {
							// do nothing
						}
					}
				}

				// push sort by meta to meta query array
				if( ! empty( $sort_meta ) ){
					array_push( $meta_query, $sort_meta );
				}

				// category in filter
				if( $cat_in ){
					$cat_in_filter = array(
						'taxonomy' => 'product_cat',
						'field'    => 'term_id',
						'terms'    => $cat_in,
					);
					array_push( $tax_query, $cat_in_filter );
				}

				// Combining search result ids and other product ids
				if( ! empty( $search_ids ) ){
					if( ! empty( $posts_in ) ) {
						$posts_in = array_intersect( $posts_in, $search_ids );
					} else {
						$posts_in = $search_ids;
					}
				}
				
				// post in main query param
				if( ! empty( $posts_in ) ) {
					$args['post__in'] = $posts_in;
				}

				// sorting main query order param
				if( ! empty( $order ) ){
					$args['order'] = $order;
				}

				// sorting main query order by param
				if( ! empty( $order_by ) && $order_by != 'none' ){
					$args['orderby'] = $order_by;
				}

				// othen main query params
				$args['posts_per_page'] = $products_per_page;
				$args['meta_query'] = $meta_query;
				$args['tax_query'] = $tax_query;

				// pagination param
				if( $pagination_status ){
					$args['paged'] = $paged;
				}

				// serial number initialisation
				$serial_no = ( ( $paged - 1 ) * $products_per_page ) + 1;

				// loadmore wp query offset param & serial no initial for loadmore case
				if( $loadmore_click ){
					$args['offset'] = $offset;
					$serial_no = $offset + 1;
					// updating offset
					$offset = $offset + $products_per_page;
				} else {
					$offset = $products_per_page;
				}

				// main query wp_query
				$products_query = new WP_Query( $args );

				// result count sidebarnav
				$sidebar_result_count = '';
				if( ! empty( $nav_sidebar_elems ) ){
					ob_start();
					foreach( $nav_sidebar_elems as $elem ){
						if( $elem['id'] == 'resultCount' ){
							include( $this->filters_dir.'/result-count.php' );
						}
					}
					$sidebar_result_count = ob_get_contents();
					ob_end_clean();
				}

				// result count head nav left
				$head_left_result_count = '';
				if( ! empty( $nav_head_left_elems ) ){
					ob_start();
					foreach( $nav_head_left_elems as $elem ){
						if( $elem['id'] == 'resultCount' ){
							include( $this->filters_dir.'/result-count.php' );
						}
					}
					$head_left_result_count = ob_get_contents();
					ob_end_clean();
				}

				// result count head nav right
				$head_right_result_count = '';
				if( ! empty( $nav_head_right_elems ) ){
					ob_start();
					foreach( $nav_head_right_elems as $elem ){
						if( $elem['id'] == 'resultCount' ){
							include( $this->filters_dir.'/result-count.php' );
						}
					}
					$head_right_result_count = ob_get_contents();
					ob_end_clean();
				}

				// product query loop
				if ( $products_query->have_posts() ) :
					ob_start();
					while ( $products_query->have_posts() ): $products_query->the_post();
						global $product;
						include( $this->templates_dir.'/table-body.php' );
						$serial_no++;
					endwhile;

					// table data
					$table_data = ob_get_contents();
					ob_end_clean();

					// pagination content
					$pagination_html = '';
					if( $pagination_status ){
						$current_page = $paged;
						ob_start();
						include( $this->templates_dir.'/pagination.php' );
						$pagination_html = ob_get_contents();
						ob_end_clean();
					}

					// result array
					$result = array(
						'success' => true,
						'table_data' => $table_data,
						'pagination' => $pagination_html,
						'offset' => $offset,
						'found_posts' => $products_query->found_posts,
						'sidebar_result_count' => $sidebar_result_count,
						'head_left_result_count' => $head_left_result_count,
						'head_right_result_count' => $head_right_result_count
					);
				else:
					// result array
					$not_found_msg = '<p class="awcpt-product-found-msg">'.__( $gen_labels['prdNotFound'], 'product-table-for-woocommerce' ).'</p>';
					$result = array(
						'success' => false,
						'not_found_msg' => $not_found_msg,
						'sidebar_result_count' => $sidebar_result_count,
						'head_left_result_count' => $head_left_result_count,
						'head_right_result_count' => $head_right_result_count
					);
				endif;
				wp_reset_postdata();
			} else {
				// result array
				$not_found_msg = '<p class="awcpt-product-found-msg">'.__( $gen_labels['prdNotFound'], 'product-table-for-woocommerce' ).'</p>';
				$result = array(
					'success' => false,
					'not_found_msg' => $not_found_msg,
				);
			}
		} else {
			// result array
			$not_found_msg = '<p class="awcpt-product-found-msg">'.__( $gen_labels['prdNotFound'], 'product-table-for-woocommerce' ).'</p>';
			$result = array(
				'success' => false,
				'not_found_msg' => $not_found_msg,
			);
		}
		// response
		wp_send_json( $result );
		wp_die();
	}




	/**
	 * Additional awcpt fragments hook for Footer cart widget callback
	 * @access  public
	 * @since   1.0.0
	 */
	public function wcpt_add_to_cart_fragments($fragments)
	{
		ob_start();
		include_once($this->templates_dir . '/cart-widget.php');
		$cart_widget = ob_get_clean();
		$fragments['div.awcpt-cart-widget'] = $cart_widget;
		return $fragments;
	}

	/**
	 * Footer cart widget callback
	 * @access  public
	 * @since   1.0.0
	 */
	public function awcpt_cart_widget()
	{
		include_once($this->templates_dir . '/cart-widget.php');
	}

}
