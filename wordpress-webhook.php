<?php
/**
 * Plugin Name: Bluerange Next.js Webhook
 * Description: Sends webhook to Next.js when posts/pages/media are updated
 * Version: 1.0.0
 * Author: Bluerange
 */

// ─── Config
define('BR_NEXTJS_WEBHOOK_URL', 'https://your-vercel-domain.com/api/revalidate');
define('BR_NEXTJS_IMAGE_WEBHOOK_URL', 'https://your-vercel-domain.com/api/wp-image-webhook');
define('BR_REVALIDATE_SECRET', 'your-secret-key-here');

// ─── Send Webhook Helper
function br_send_webhook($url, $payload, $secret_header = 'X-Revalidate-Secret', $secret = BR_REVALIDATE_SECRET) {
    $args = array(
        'body'        => json_encode($payload),
        'headers'     => array(
            'Content-Type' => 'application/json',
            $secret_header => $secret,
        ),
        'timeout'     => 15,
        'blocking'    => true,
        'sslverify'   => true,
    );
    $response = wp_remote_post($url, $args);
    
    if (is_wp_error($response)) {
        error_log('[Bluerange Webhook] Error: ' . $response->get_error_message());
        return false;
    }
    
    return $response;
}

// ─── Post/Page Save Hook
function br_on_post_save($post_id, $post, $update) {
    // Skip auto-drafts and revisions
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }
    
    // Only trigger for published posts/pages
    if (!in_array($post->post_type, array('post', 'page'))) {
        return;
    }
    
    $slug = $post->post_name;
    $lang = function_exists('pll_get_post_language') ? pll_get_post_language($post_id) : 'sv';
    
    $payload = array(
        'slug' => $slug,
        'lang' => $lang,
        'post_id' => $post_id,
        'post_type' => $post->post_type,
    );
    
    br_send_webhook(BR_NEXTJS_WEBHOOK_URL, $payload);
}
add_action('save_post', 'br_on_post_save', 10, 3);

// ─── Media Upload/Update Hook
function br_on_media_save($post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'attachment') {
        return;
    }
    
    $payload = array(
        'ID' => $post_id,
        'post_type' => 'attachment',
        'guid' => array('rendered' => wp_get_attachment_url($post_id)),
        'source_url' => wp_get_attachment_url($post_id),
        'mime_type' => get_post_mime_type($post_id),
    );
    
    br_send_webhook(
        BR_NEXTJS_IMAGE_WEBHOOK_URL, $payload, 'X-WP-Webhook-Secret', BR_REVALIDATE_SECRET
    );
}
add_action('add_attachment', 'br_on_media_save');
add_action('edit_attachment', 'br_on_media_save');

// ─── Settings Page
function br_webhook_settings_page() {
    add_options_page(
        'Bluerange Webhook Settings',
        'Bluerange Webhook',
        'manage_options',
        'br-webhook-settings',
        'br_webhook_settings_html'
    );
}
add_action('admin_menu', 'br_webhook_settings_page');

function br_webhook_settings_html() {
    if (!current_user_can('manage_options')) {
        return;
    }
    ?>
    <div class="wrap">
        <h1>Bluerange Next.js Webhook Settings</h1>
        <p>Configure your Next.js webhook URLs and secret key here.</p>
        <p><strong>Note:</strong> For security, it's recommended to define these constants in wp-config.php instead.</p>
        <table class="form-table">
            <tr valign="top">
                <th scope="row">Webhook URL</th>
                <td><code><?php echo esc_html(BR_NEXTJS_WEBHOOK_URL); ?></code></td>
            </tr>
            <tr valign="top">
                <th scope="row">Image Webhook URL</th>
                <td><code><?php echo esc_html(BR_NEXTJS_IMAGE_WEBHOOK_URL); ?></code></td>
            </tr>
            <tr valign="top">
                <th scope="row">Secret Key</th>
                <td><code><?php echo esc_html(BR_REVALIDATE_SECRET); ?></code></td>
            </tr>
        </table>
        <h2>How to Configure in wp-config.php</h2>
        <pre>
define('BR_NEXTJS_WEBHOOK_URL', 'https://your-domain.com/api/revalidate');
define('BR_NEXTJS_IMAGE_WEBHOOK_URL', 'https://your-domain.com/api/wp-image-webhook');
define('BR_REVALIDATE_SECRET', 'your-long-random-secret-key');
        </pre>
    </div>
    <?php
}
