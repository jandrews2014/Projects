<div class="new-forum alt-bg">
	<?php $this->load->view('forum/forum_navigation', array('routes' => $routes, 'active_url' => $active_url)); ?>
	<?php ($this->system->is_staff())? $staff = true : $staff = false; ?>

	<?php foreach ($forums as $category_name => $forum_array): ?>
		<?php if ($category_name == "Staff"): ?>
			<?php if ($staff != true): ?>
				<?php continue; ?>
			<?php endif ?>
		<?php endif ?>

		<div class="forum-category">
			<div id="<?= strtolower($category_name); ?>_forum" class="header-img">
				<img src="/images/forum_icons/<?= strtolower($category_name); ?>.png" /><!--<h1><?= ucfirst($category_name); ?></h1>-->
			</div>
			<ul>
				<?php foreach ($forum_array as $forum_data): ?>
<!--   				<?php if($forum_data['forum_name'] == "Team Bo-Bombs"): ?>
				<?php if($user['faction'] != 'Bobomb' && !$this->system->is_admin() && !$this->system->is_mod() && !$this->system->is_developer() ): ?>
 				<?php continue; ?>
				<?php endif; ?>
				<?php endif; ?>
				<?php if($forum_data['forum_name'] == "Team Odd-Balls"): ?>
				<?php if($user['faction'] != 'Oddball' && !$this->system->is_admin() && !$this->system->is_mod() && !$this->system->is_developer() ): ?>
 				<?php continue; ?>
				<?php endif; ?>
				<?php endif; ?>
 -->				<li class="left">
					<a href="/forum/view/<?= $forum_data['forum_id'] ?>" id="forum_<?= $forum_data['forum_id'] ?>">
						<h2><?= $forum_data['forum_name'] ?></h2>
						<?= $forum_data['forum_description'] ?>
					</a>
				</li>
				<?php endforeach ?>
				<div class="clearfix"></div>
			</ul>
		</div>
	<?php endforeach ?>

	<div class="row">
		<div class="forum-stats" style="background-color: #cbc0a5; margin-left:65px; margin-right:60px;position:relative;">
			<div class="grid_5" style="margin:0px 0px 0px 20px;">
				<h5 style="margin:0 0 3px;">There are currently <?= count($user_onlin) ?> online users <span style="color:#8f8f8f; font-weight:normal; font-size:11px;">(<?= count($user_onlin) ?> Caedonians, 0 Guests)</span></h5>
				<?php foreach ($user_onlin as $key => $value) { ?>
					<?php if (urlencode($value->username) == "w0xy"){ ?>
						<a href="/user/w0xy" class="w0xy"  style="font-weight:bold;"><span class="w0xy4" style="color:#d6b6dd;">w</span><span class="w0xy2" style="color:#6CCFFF">0</span><span class="w0xy3" >x</span><span class="w0xy4" style="color:#AB9AFF;">y</span></a><?php //echo ($user_key != count($users_online)-1 ? ', ' : '') ?>
					<?php }else{ ?>
						<a href="/user/<?= urlencode($value->username) ?>" style="<?= user_style($value->user_level) ?>"><?= $value->username; ?></a>
					<?php } ?>
				<?php } ?>
				<!--?php foreach ($users_online as $user_key => $user): ?>
					<a href="/user/<?php //echo urlencode($user['username']) ?>" style="<?php //echo user_style($user['user_level']) ?>"><?php //echo $user['username'] ?></a><?php //echo ($user_key != count($users_online)-1 ? ', ' : '') ?>
				<?php //endforeach ?>-->
			</div>
			<div class="grid_2" style="position:absolute;">
				<div style="height: 1px; /*background-color: #b2d898;*/ padding-left:5px; font-family:arial; margin:5px 0 13px 0; clear:both;">
					<span style="position: relative; top: -0.73em; padding:0 6px; text-transform:uppercase; color:#476d20; font-size:11px; font-weight:bold;">
						<img src="/images/icons/statistics.png" alt="" style="margin-top:-4px"></img> Caedon's Statistics
					</span>
				</div>
				<div style="font-size:14px;">Total posts: <strong><?=number_format($total_posts)?></strong></div>
				<div style="font-size:14px;">Total users: <strong><?=number_format($total_users)?></strong></div>
			</div>
			<div class="clearfix"></div>
		</div>
	</div>
</div>
