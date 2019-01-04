<template>
  <el-container>
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt>
          </div>
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1" class="loginout">
          <a href="#" @click.prevent="loginOut()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" unique-opened router>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="1-2">
              <i class="el-icon-menu"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="1-3">
              <i class="el-icon-menu"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-4">
              <i class="el-icon-menu"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="1-5">
              <i class="el-icon-menu"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="1-6">
              <i class="el-icon-menu"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-7">
              <i class="el-icon-menu"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-8">
              <i class="el-icon-menu"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate() {
    if (localStorage.token) {
      this.$router.push({
        path: "/"
      });
    } else {
      this.$message.warning('请登录后再进行该操作~')
      this.$router.push({
        name: "login"
      });
    }
    // if(!localStorage.getItem('token')) {
    //   this.$message.warning('请登录后再进行该操作~')
    //   this.$router.push({
    //     name: "login"
    //   })
    // }
  },
  methods: {
    // 用户退出
    loginOut() {
      // 1、清除token
      localStorage.clear();
      // 2、回到登陆页面
      this.$router.push({
        name: "login"
      });
      // 3、提示

      this.$message.success("退出成功~");
    }
  }
};
</script>

<style>
.el-container {
  height: 100%;
}

.el-container .header {
  background-color: #b3c0d1;
}

.middle {
  line-height: 60px;
  color: #fff;
  text-align: center;
}

.loginout a {
  line-height: 60px;
  text-decoration: none;
}
</style>
