<?php

if (!defined('ABSPATH'))
    exit;

class AWCPT_Api
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
    private $_active = false;

    public function __construct()
    {
        add_action('rest_api_init', function () {
            register_rest_route('awcpt/v1', '/get_woo_datas/', array(
                'methods' => 'GET',
                'callback' => array($this, 'get_woo_datas'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/save_table_data/', array(
                'methods' => 'POST',
                'callback' => array($this, 'save_table_data'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/get_table_data/', array(
                'methods' => 'POST',
                'callback' => array($this, 'get_table_data'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/get_table_list/', array(
                'methods' => 'GET',
                'callback' => array($this, 'get_table_list'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/delete_table/', array(
                'methods' => 'POST',
                'callback' => array($this, 'delete_table'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/save_general_settings/', array(
                'methods' => 'POST',
                'callback' => array($this, 'save_general_settings'),
                'permission_callback' => array($this, 'get_permission')
            ));

            register_rest_route('awcpt/v1', '/get_general_settings/', array(
                'methods' => 'GET',
                'callback' => array($this, 'get_general_settings'),
                'permission_callback' => array($this, 'get_permission')
            ));

        });
    }

    /**
     *
     * Ensures only one instance of AWCPT is loaded or can be loaded.
     *
     * @since 1.0.0
     * @static
     * @see WordPress_Plugin_Template()
     * @return Main AWCPT instance
     */
    public static function instance($file = '', $version = '1.0.0')
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($file, $version);
        }
        return self::$_instance;
    }

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

    /**
     * Permission Callback
    **/
    public function get_permission()
    {
        if (current_user_can('administrator') || current_user_can('manage_woocommerce')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get woo product datas 
     * @return WP_REST_Response
     * @throws Exception
    */
    public function get_woo_datas()
    {
        // get categories
        $prd_cats = get_terms( array(
            'taxonomy' => 'product_cat',
            'orderby' => 'name',
            'hide_empty' => false,
            'fields' => 'id=>name',
            'number' => 0
        ));
        if( $prd_cats && !is_wp_error($prd_cats) ){
            foreach( $prd_cats as $id => $name ){
                $val_arry = array('value' => $id);
                $label_arry = array('label' => $name);
                $cat_array[] = array_merge($val_arry, $label_arry);
            }
            $result['cats'] = $cat_array;
        } else {
            $result['cats'] = null;
        }

        // Get product tags
        $prd_tags = get_terms( array(
            'taxonomy' => 'product_tag',
            'orderby' => 'name',
            'hide_empty' => false,
            'fields' => 'id=>name',
            'number' => 0
        ));
        if( $prd_tags && !is_wp_error($prd_tags) ){
            foreach( $prd_tags as $id => $name ){
                $val_arry = array('value' => $id);
                $label_arry = array('label' => $name);
                $tag_array[] = array_merge($val_arry, $label_arry);
            }
            $result['tags'] = $tag_array;

        } else {
            $result['tags'] = null;
        }

        // get product types
        $prd_types = get_terms( array(
            'taxonomy' => 'product_type',
            'orderby' => 'name',
            'hide_empty' => false,
            'fields' => 'id=>name',
            'number' => 0
        ));
        if( $prd_types && !is_wp_error($prd_types) ){
            foreach( $prd_types as $id => $name ){
                $val_arry = array('value' => $id);
                $label_arry = array('label' => $name);
                $types_array[] = array_merge($val_arry, $label_arry);
            }
            $result['types'] = $types_array;

        } else {
            $result['types'] = null;
        }

        // get product visibility terms
        $prd_visibility = get_terms( array(
            'taxonomy' => 'product_visibility',
            'orderby' => 'name',
            'hide_empty' => false,
            'fields' => 'id=>name',
            'number' => 0
        ));
        if( $prd_visibility && !is_wp_error($prd_visibility) ){
            foreach( $prd_visibility as $id => $name ){
                if( $name != 'outofstock' ){
                    $val_arry = array('value' => $id);
                    $label_arry = array('label' => $name);
                    $visibility_array[] = array_merge($val_arry, $label_arry);
                }
            }
            $result['visibilities'] = $visibility_array;

        } else {
            $result['visibilities'] = null;
        }

        // product attrubute names
        $variation_attributes = wc_get_attribute_taxonomy_labels();
        if( $variation_attributes && !is_wp_error($variation_attributes) ){
            foreach( $variation_attributes as $name => $label ){
                $val_arry = array('value' => $name);
                $label_arry = array('label' => $label);
                $attribute_array[] = array_merge($val_arry, $label_arry);
            }
            $result['attributes'] = $attribute_array;
        } else {
            $result['attributes'] = null;
        }

        // image sizes
        $image_size_array[0] = array( 'value' => 'thumbnail', 'label' => __( 'Thumbnail (150 x 150 cropped)', 'product-table-for-woocommerce' ) );
        $image_size_array[1] = array( 'value' => 'medium', 'label' => __( 'Medium (300 x 300)', 'product-table-for-woocommerce' ) );
        $image_size_array[2] = array( 'value' => 'medium_large', 'label' => __( 'Medium Large (768 x 0 infinite height)', 'product-table-for-woocommerce' ) );
        $image_size_array[3] = array( 'value' => 'large', 'label' => __( 'Large resolution (1024 x 1024)', 'product-table-for-woocommerce' ) );
        $image_size_array[4] = array( 'value' => 'full', 'label' => __( 'Full (original size)', 'product-table-for-woocommerce' ) );
        $custom_image_sizes = wp_get_additional_image_sizes();
        if( $custom_image_sizes ){
            foreach( $custom_image_sizes as $slug => $props ){
                $lbl = $slug." (";
                if( isset( $props['width'] ) && $props['width'] ){
                    $lbl .= $props['width']." x";
                }

                if( isset( $props['height'] ) && $props['height'] ){
                    $lbl .= " ".$props['height'];
                } else {
                    $lbl .= " ".__( '0 infinite height', 'product-table-for-woocommerce' );
                }

                if( isset( $props['crop'] ) && $props['crop'] ){
                    $lbl .= " ".__( 'cropped', 'product-table-for-woocommerce' );
                }

                $lbl .= ")";
                $val_arry = array('value' => $slug);
                $label_arry = array('label' => $lbl);
                $image_size_array[] = array_merge($val_arry, $label_arry);
            }
        }
        $result['imageSizes'] = $image_size_array;
        $result['status'] = 1;
        return new WP_REST_Response($result, 200);
    }

    /**
     * Save table data
     * @return WP_REST_Response
     * @throws Exception
    */
    public function save_table_data($data)
    {
        $request_body = $data->get_params();
        $settings = $request_body['settings'];

        // table base infos
        $table_id = $settings['tblID'];
        $table_title = $settings['tblTitle'];

        // table columns settings
        $table_cols = $settings['tableColsSelected'];

        // table navigation settings
        $table_nav_settings['sidbar_elems'] = $settings['navSidbarElems'];
        $table_nav_settings['head_layout'] = $settings['navHeadLayout'];
        $table_nav_settings['head_left_elems'] = $settings['navHeadLeftElems'];
        $table_nav_settings['head_right_elems'] = $settings['navHeadRightElems'];

        // table design settings
        $table_design['head'] = $settings['tableHeadStyles'];
        $table_design['body'] = $settings['tableBodyStyles'];
        $table_design['button'] = $settings['btnStyles'];
        $table_design['pagination'] = $settings['paginationStyles'];
        $table_design['responsive_mode'] = $settings['responsiveMode'];
        $table_design['custom_css'] = $settings['customCss'];

        // basic query and config settings
        $table_config['types'] = $settings['prdTypes'];
        $table_config['visibility'] = $settings['prdVisibility'];
        $table_config['cats'] = $settings['catIn'];
        $table_config['tags'] = $settings['tagIn'];
        $table_config['prd_ids'] = $settings['prdByID'];
        $table_config['skus'] = $settings['prdBySku'];
        $table_config['exclude_cats'] = $settings['catExc'];
        $table_config['exclude_tags'] = $settings['tagExc'];
        $table_config['exclude_prd_ids'] = $settings['excPrdByID'];
        $table_config['order'] = $settings['order'];
        $table_config['order_by'] = $settings['orderBy'];
        $table_config['order_meta_key'] = $settings['orderMetaKey'];
        $table_config['min_price'] = $settings['minPrice'];
        $table_config['max_price'] = $settings['maxPrice'];
        $table_config['only_stock'] = $settings['onlyInStock'];
        $table_config['only_sale'] = $settings['onlyOnSale'];
        $table_config['products_per_page'] = $settings['productsPerPage'];
        $table_config['search_target_fields'] = $settings['searchTargetFlds'];
        $table_config['pagination'] = $settings['pagination'];
        $table_config['ajax_pagination'] = $settings['ajaxPagination'];
        $table_config['load_more'] = $settings['loadMoreBtn'];
        $table_config['load_more_txt'] = $settings['loadMoreBtnTxt'];
        $table_config['add_all_to_cart'] = $settings['addAllToCartBtn'];
        $table_config['add_all_to_cart_txt'] = $settings['addAllToCartTxt'];
        $table_config['table_class'] = $settings['tableClass'];
        $table_config['show_table_head'] = $settings['showTblHead'];
        $table_config['table_width'] = $settings['tableWidth'];

        // saving arrays
        $awcpt_data = array();
        $awcpt_data['columns'] = $table_cols;
        $awcpt_data['design'] = $table_design;
        $awcpt_query = array();
        $awcpt_query['config'] = $table_config;
        $awcpt_query['navigation'] = $table_nav_settings;

        if( $table_id ){
            $args = array(
                'ID' => $table_id,
                'post_title' => wp_strip_all_tags( $table_title ),
                'post_status' => 'publish',
                'post_type' => 'aco_product_table'
            );

            $updated_table_id = wp_update_post( $args );
            if( $updated_table_id && !is_wp_error( $updated_table_id ) ){
                update_post_meta( $table_id, 'awcpt_data', maybe_serialize( $awcpt_data ) );
                update_post_meta( $table_id, 'awcpt_query', maybe_serialize( $awcpt_query ) );
                // response
                $result['tableID'] = $table_id;
                $result['status'] = 1;
            } else {
                $result['status'] = 0;
            }
        } else {
            $args = array(
                'post_title' => wp_strip_all_tags( $table_title ),
                'post_status' => 'publish',
                'post_type' => 'aco_product_table'
            );
            $new_table_id = wp_insert_post( $args );

            if( $new_table_id && !is_wp_error( $new_table_id ) ){
                add_post_meta( $new_table_id, 'awcpt_data', maybe_serialize( $awcpt_data ), true );
                add_post_meta( $new_table_id, 'awcpt_query', maybe_serialize( $awcpt_query ), true );
                // response
                $result['tableID'] = $new_table_id;
                $result['status'] = 1;
            } else {
                $result['status'] = 0;
            }
        }
        return new WP_REST_Response($result, 200);
    }

    /**
     * Get table data
     * @return WP_REST_Response
     * @throws Exception
    */
    public function get_table_data($data)
    {
        $request_body = $data->get_params();
        $table_id = $request_body['tableID'];
        if( $table_id ){
            $result['settings']['tblTitle'] = get_the_title( $table_id );
            $awcpt_data_serialized = get_post_meta( $table_id, 'awcpt_data', true );
            $awcpt_query_serialized = get_post_meta( $table_id, 'awcpt_query', true );
            if( $awcpt_data_serialized ){
                $awcpt_data = maybe_unserialize( $awcpt_data_serialized );
                if( $awcpt_data ){
                    $tbl_cols = $awcpt_data['columns'];
                    $tbl_design = $awcpt_data['design'];
                    $result['settings']['tableColsSelected'] = $tbl_cols;
                    $result['settings']['tableHeadStyles'] = $tbl_design['head'];
                    $result['settings']['tableBodyStyles'] = $tbl_design['body'];
                    $result['settings']['btnStyles'] = $tbl_design['button'];
                    $result['settings']['paginationStyles'] = $tbl_design['pagination'];
                    $result['settings']['responsiveMode'] = $tbl_design['responsive_mode'];
                    $result['settings']['customCss'] = $tbl_design['custom_css'];
                }
            }

            if( $awcpt_query_serialized ){
                $awcpt_query = maybe_unserialize( $awcpt_query_serialized );
                if( $awcpt_query ){
                    $tbl_navs = $awcpt_query['navigation'];
                    $result['settings']['navSidbarElems'] = $tbl_navs['sidbar_elems'];
                    $result['settings']['navHeadLayout'] = $tbl_navs['head_layout'];
                    $result['settings']['navHeadLeftElems'] = $tbl_navs['head_left_elems'];
                    $result['settings']['navHeadRightElems'] = $tbl_navs['head_right_elems'];
                    $tbl_config = $awcpt_query['config'];
                    $result['settings']['prdTypes'] = $tbl_config['types'];
                    $result['settings']['prdVisibility'] = $tbl_config['visibility'];
                    $result['settings']['catIn'] = $tbl_config['cats'];
                    $result['settings']['tagIn'] = $tbl_config['tags'];
                    $result['settings']['prdByID'] = $tbl_config['prd_ids'];
                    $result['settings']['prdBySku'] = $tbl_config['skus'];
                    $result['settings']['catExc'] = $tbl_config['exclude_cats'];
                    $result['settings']['tagExc'] = $tbl_config['exclude_tags'];
                    $result['settings']['excPrdByID'] = $tbl_config['exclude_prd_ids'];
                    $result['settings']['order'] = $tbl_config['order'];
                    $result['settings']['orderBy'] = $tbl_config['order_by'];
                    $result['settings']['orderMetaKey'] = $tbl_config['order_meta_key'];
                    $result['settings']['minPrice'] = $tbl_config['min_price'];
                    $result['settings']['maxPrice'] = $tbl_config['max_price'];
                    $result['settings']['onlyInStock'] = $tbl_config['only_stock'];
                    $result['settings']['onlyOnSale'] = $tbl_config['only_sale'];
                    $result['settings']['productsPerPage'] = $tbl_config['products_per_page'];
                    $result['settings']['searchTargetFlds'] = $tbl_config['search_target_fields'];
                    $result['settings']['pagination'] = $tbl_config['pagination'];
                    $result['settings']['ajaxPagination'] = $tbl_config['ajax_pagination'];
                    $result['settings']['loadMoreBtn'] = $tbl_config['load_more'];
                    $result['settings']['loadMoreBtnTxt'] = $tbl_config['load_more_txt'];
                    $result['settings']['addAllToCartBtn'] = $tbl_config['add_all_to_cart'];
                    $result['settings']['addAllToCartTxt'] = $tbl_config['add_all_to_cart_txt'];
                    $result['settings']['tableClass'] = $tbl_config['table_class'];
                    $result['settings']['showTblHead'] = $tbl_config['show_table_head'];
                    $result['settings']['tableWidth'] = isset( $tbl_config['table_width'] ) ? $tbl_config['table_width'] : '';
                }
            }
            $result['status'] = 1;
        } else {
            $result['status'] = 0;
        }

        return new WP_REST_Response($result, 200);
    }

    /**
     * Get added tables list
     * @return WP_REST_Response
     * @throws Exception
    */
    public function get_table_list()
    {
        $table_list = array();
        $args = array(
            'post_type' => 'aco_product_table',
            'post_status' => 'publish',
            'posts_per_page' => -1
        );
        $table_query = new WP_Query( $args );
        if ( $table_query->have_posts() ) :
            while ( $table_query->have_posts() ) : $table_query->the_post();
                $table_data = array(
                    'id' => get_the_ID(),
                    'title' => get_the_title(),
                    'date' => get_the_date( 'd/M/Y' )
                );
                $table_list[] = $table_data;
            endwhile;
            wp_reset_postdata();
            // response
            $result['tableList'] = $table_list;
            $result['status'] = 1;
        else:
            $result['status'] = 0;
        endif;
        return new WP_REST_Response($result, 200);
    }

    /**
     * Delete selected table
     * @return WP_REST_Response
     * @throws Exception
    */
    public function delete_table($data)
    {
        $request_body = $data->get_params();
        $table_id = $request_body['tableID'];
        if( $table_id ){
            // deleting
            $r = wp_delete_post( $table_id, true );
            if( $r && !is_wp_error( $r ) ){
                // returning new table list
                $table_list = array();
                $args = array(
                    'post_type' => 'aco_product_table',
                    'post_status' => 'publish',
                    'posts_per_page' => -1
                );
                $table_query = new WP_Query( $args );
                if ( $table_query->have_posts() ) :
                    while ( $table_query->have_posts() ) : $table_query->the_post();
                        $table_data = array(
                            'id' => get_the_ID(),
                            'title' => get_the_title(),
                            'date' => get_the_date( 'd/M/Y' )
                        );
                        $table_list[] = $table_data;
                    endwhile;
                    wp_reset_postdata();
                    // response
                    $result['tableList'] = $table_list;
                    $result['status'] = 1;
                else:
                    $result['tableList'] = '';
                    $result['status'] = 1;
                endif;
            } else {
                $result['status'] = 0;
            }
        } else {
            $result['status'] = 0;
        }
        return new WP_REST_Response($result, 200);
    }

    /**
     * Save general settings
     * @return WP_REST_Response
     * @throws Exception
    */
    public function save_general_settings($data)
    {
        $request_body = $data->get_params();
        $cart_settings = $request_body['cartSettings'];
        $label_settings = $request_body['labelSettings'];
        $gen_settings = array();
        $gen_settings['cart'] = $cart_settings;
        $gen_settings['labels'] = $label_settings;
        if ( false === get_option( 'awcpt_general_settings' ) ){
            $r = add_option( 'awcpt_general_settings', maybe_serialize( $gen_settings ), '', 'yes' );
        } else {
            $r = update_option( 'awcpt_general_settings', maybe_serialize( $gen_settings ) );
        }
        if( $r ){
            $result['status'] = 1;
        } else {
            $result['status'] = 0;
        }
        return new WP_REST_Response($result, 200);
    }

    /**
     * Get general settings
     * @return WP_REST_Response
     * @throws Exception
    */
    public function get_general_settings()
    {
        $gen_settings_serialize = get_option( 'awcpt_general_settings' );
        if( $gen_settings_serialize ){
            $gen_settings = maybe_unserialize( $gen_settings_serialize );
            if( $gen_settings ){
                $result['settings']['cart'] = $gen_settings['cart'];
                $result['settings']['labels'] = $gen_settings['labels'];
                $result['status'] = 1;
            } else {
                $result['status'] = 0;
            }
        } else {
            $result['status'] = 0;
        }

        return new WP_REST_Response($result, 200);
    }
}
