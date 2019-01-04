<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="input-search"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="success" @click="showAdd()">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%" height="300px">
      <el-table-column prop="id" label="#" width="70"></el-table-column>
      <el-table-column prop="username" label="姓名" width="90"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column label="创建日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time | formDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeState(scope.row)"
            active-color="#13ce66"
            inactive-color="#ccc"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            plain
            size="small"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEdit(scope.row)"
          ></el-button>
          <el-button
            plain
            size="small"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDele(scope.row)"
          ></el-button>
          <el-button
            plain
            size="small"
            type="success"
            icon="el-icon-check"
            circle
            @click="showRole(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUsername}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- {{currRoleId}} -->
          <el-select v-model="currRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 控制对话框显示/隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formLabelWidth: "100px",
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      roles: [],
      currUsername: "",
      currRoleId: -1,
      currUserId: -1

    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色
    async addRole() {
      
      const res = await this.$http.put(`users/${this.currUserId}/role`,{
        rid: this.currRoleId
      });
      // console.log(res);
      const {
        meta: {status, msg}
      } = res.data;
      if(status === 200) {
        this.$message.success(msg);
      }
      this.dialogFormVisibleRole = false;
    },

    // 弹出角色框
    async showRole(user) {
      console.log(user);
      this.currUsername = user.username;
      this.currUserId = user.id;
      this.dialogFormVisibleRole = true;
      // 获取所有角色的用户名
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }

      // 根据用户ID获取角色ID
      const roleId = await this.$http.get(`users/${user.id}`)
      // console.log(roleId);
      this.currRoleId = roleId.data.data.rid;
    },

    // 修改用户状态
    async changeState(user) {
      // console.log(user);
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },

    // 编辑用户信息
    async editUser(user) {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.dialogFormVisibleEdit = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },

    //  编辑弹出框
    async showEdit(user) {
      this.dialogFormVisibleEdit = true;
      const res = await this.$http.get(`users/${user.id}`);
      // console.log(res);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 200) {
        this.form = data;
      }
    },

    //  弹出确认框
    // async showDele(ID) {
    //   this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //   const res = await this.$http.delete('users/:id')
    //   console.log(res);
    showDele(user) {
      // console.log(ID);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { status, msg }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    //  添加用户
    async addUser() {
      const res = await this.$http.post("users", this.form);
      console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.dialogFormVisibleAdd = false;
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    //  显示弹出框
    showAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    //  清空输入框后显示所有数据
    getAllUsers() {
      this.getTableData();
    },
    //  模糊搜索
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        data: {
          meta: { status, msg },
          data: { total, users }
        }
      } = res;
      if (status === 200) {
        this.tableData = users;
        console.log(this.tableData);

        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getTableData();
      console.log(`当前页: ${val}`);
    }
  }
};
</script> 

<style>
.box-card {
  height: 100%;
}

.input-search {
  width: 350px;
  margin-top: 10px;
}

.btn {
  width: 60px;
  background: #999;
}

.cell {
  text-align: center;
}
</style>
