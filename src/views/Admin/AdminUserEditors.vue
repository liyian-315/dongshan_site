<template>
  <div class="user-management-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.fullname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUsers">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户列表区域 -->
    <div class="user-list-area">
      <el-table :data="users" border class="user-table">
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="fullname" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="hasSignedPdf" label="是否为实习生">
          <template #default="{ row }">
            <!-- 添加@change事件监听状态变化 -->
            <el-switch
                v-model="row.hasSignedPdf"
                @change="handleInternStatusChange(row)"
                :loading="loading[row.id]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="company" label="公司" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container" v-if="total > 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑用户" v-model="dialogVisible" width="50%">
      <el-form :model="editForm" ref="editFormRef" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="姓名" prop="fullname">
          <el-input v-model="editForm.fullname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" type="email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-input v-model="editForm.role" />
        </el-form-item>
        <el-form-item label="是否为实习生" prop="hasSignedPdf">
          <el-switch v-model="editForm.hasSignedPdf" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="公司" prop="company">
          <el-input v-model="editForm.company" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="bankCardNumber">
          <el-input v-model="editForm.bankCardNumber" />
        </el-form-item>
        <el-form-item label="Gitee 名称" prop="giteeName">
          <el-input v-model="editForm.giteeName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEdit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElTable, ElTableColumn, ElButton, ElDialog, ElForm, ElFormItem, ElInput, ElSwitch, ElPagination } from 'element-plus'
import { selectUser, updateUser, deleteUser } from '@/api/user' // 引入封装的 API 函数

// 搜索表单
const searchForm = reactive({
  username: '',
  fullname: ''
})

// 用户列表相关
const users = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
// 用于存储每个用户的加载状态
const loading = ref({})

// 编辑弹窗相关
const dialogVisible = ref(false)
const editForm = reactive({})
const editFormRef = ref(null)
const currentEditUserId = ref(null)

// 搜索用户
const searchUsers = async () => {
  try {
    const params = {
      username: searchForm.username,
      fullname: searchForm.fullname,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }
    const response = await selectUser(params)
    users.value = response.list || []
    total.value = response.total || 0
  } catch (error) {
    console.error('查询用户失败：' + error.message)
    // ElMessage.error('查询用户失败：' + error.message)
  }
}

// 处理实习生状态变化
const handleInternStatusChange = async (row) => {
  // 保存原始状态，用于更新失败时回滚
  const originalStatus = !row.hasSignedPdf
  // 设置加载状态
  loading.value[row.id] = true

  try {
    // 调用更新接口，只传递必要的字段
    await updateUser({
      id: row.id,
      hasSignedPdf: row.hasSignedPdf
    })
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 更新失败，回滚状态
    row.hasSignedPdf = originalStatus
    ElMessage.error('状态更新失败：' + error.message)
  } finally {
    // 清除加载状态
    loading.value[row.id] = false
  }
}

// 编辑用户
const handleEdit = (row) => {
  currentEditUserId.value = row.id
  // 深拷贝，避免直接修改原数据
  editForm.username = row.username
  editForm.fullname = row.fullname
  editForm.email = row.email
  editForm.role = row.role
  editForm.enabled = row.enabled
  editForm.phone = row.phone
  editForm.company = row.company
  editForm.address = row.address
  editForm.bankCardNumber = row.bankCardNumber
  editForm.giteeName = row.giteeName
  editForm.hasSignedPdf = row.hasSignedPdf
  dialogVisible.value = true
}

// 提交编辑
const submitEdit = async () => {
  try {
    await editFormRef.value.validate()
    const data = {
      id: currentEditUserId.value,
      ...editForm
    }
    await updateUser(data)
    ElMessage.success('编辑用户成功')
    dialogVisible.value = false
    searchUsers() // 重新查询用户列表
  } catch (error) {
    ElMessage.error('编辑用户失败：' + error.message)
  }
}

// 删除用户
const handleDelete = async (row) => {
  try {
    await deleteUser(row.id)
    ElMessage.success('删除用户成功')
    searchUsers() // 重新查询用户列表
  } catch (error) {
    ElMessage.error('删除用户失败：' + error.message)
  }
}

// 处理每页条数变化
const handlePageSizeChange = (size) => {
  pageSize.value = size
  searchUsers()
}

// 处理当前页变化
const handleCurrentPageChange = (page) => {
  currentPage.value = page
  searchUsers()
}

// 页面加载时查询用户
onMounted(() => {
  searchUsers()
})
</script>

<style scoped>
.user-management-container {
  padding: 20px;
}

.search-area {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
}

.user-list-area {
  width: 100%;
}

.user-table {
  width: 100%;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
