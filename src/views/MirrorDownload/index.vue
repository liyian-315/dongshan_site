<template>
  <div class="page-container">
    <!-- 上部分：镜像区域 -->
    <section class="mirror-section">
      <div class="section-header">
        <h2 class="section-title">镜像</h2>
      </div>

      <!-- 架构选择标签 -->
      <div class="arch-tabs" v-loading="loading">
        <div
          v-for="arch in archList"
          :key="arch.id"
          class="arch-tab"
          :class="{ active: selectedArch && selectedArch.id === arch.id }"
          @click="selectArch(arch)"
        >
          {{ arch.title }}
        </div>
      </div>

      <!-- 单个镜像区域 -->
      <div class="mirror-area" v-if="selectedArch">
        <!-- 区域内可滚动的内容 -->
        <div class="area-content" v-if="deviceList.length > 0">
          <div class="area-menu">
            <!-- 三级菜单项（设备） -->
            <div
              v-for="device in deviceList"
              :key="device.id"
              class="menu-group"
            >
              <div
                class="menu-item"
                :class="{ active: selectedMenus[device.id] }"
                @click="handleMenuSelect(device)"
              >
                <span class="menu-text">{{ device.title }}</span>
                <el-icon class="menu-icon loading-icon" v-if="loadingMenus[device.id]">
                  <Loading />
                </el-icon>
                <el-icon class="menu-icon expanded" v-else-if="selectedMenus[device.id]">
                  <ArrowDown />
                </el-icon>
                <el-icon class="menu-icon" v-else>
                  <ArrowRight />
                </el-icon>
              </div>

              <!-- 该菜单项下的镜像列表 -->
              <transition name="slide-fade">
                <div v-if="selectedMenus[device.id] && menuMirrors[device.id]" class="mirror-list">
                  <div
                    v-for="(mirror, idx) in menuMirrors[device.id]"
                    :key="idx"
                    class="mirror-item"
                  >
                    <div class="mirror-main" @click="openMirrorInter(mirror)">
                      <span class="mirror-name" :title="mirror.name">{{ mirror.name }}</span>
                      <div class="mirror-meta">
                        <span class="meta-tag">大小: {{ mirror.size || '-' }}</span>
                        <span class="meta-tag">更新时间: {{ mirror.time || '-' }}</span>
                      </div>
                    </div>
                    <div class="mirror-action">
                      <el-button
                        class="btn-copy"
                        size="small"
                        @click.stop="copyUrl(mirror)"
                        title="复制地址"
                      >
                        <el-icon><DocumentCopy /></el-icon>
                      </el-button>
                    </div>
                  </div>

                  <!-- 空状态 -->
                  <div v-if="menuMirrors[device.id].length === 0" class="mirror-empty">
                    暂无镜像资源
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- 架构下无目录的空状态 -->
        <div class="arch-empty" v-else>
          <el-icon :size="56" class="empty-icon"><FolderOpened /></el-icon>
          <div class="empty-title">暂无资源</div>
          <div class="empty-desc">当前架构下没有可用的镜像目录</div>
        </div>
      </div>
    </section>

    <!-- 下部分：软件区域 -->
    <section class="software-section">
      <div class="section-header">
        <h2 class="section-title">软件</h2>
      </div>
      <div class="maintenance-notice">
        <el-icon :size="48" class="maintenance-icon"><Tools /></el-icon>
        <p class="maintenance-text">维护中</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue'
import {
  ElButton, ElMessage, ElIcon
} from 'element-plus'
import { DocumentCopy, Tools, ArrowRight, ArrowDown, Loading, FolderOpened } from '@element-plus/icons-vue'
import { fetchMirrorList, fetchMenuList } from '@/api/mirror.js'

// 所有菜单数据
const allMenus = ref([])

// 架构列表（一级菜单，level=0）
const archList = ref([])

// 当前选中的架构
const selectedArch = ref(null)

// 当前架构下的设备列表（三级菜单）
const deviceList = ref([])

// 选中的菜单（支持多选，用于展开/收起）
const selectedMenus = reactive({})

// 每个菜单的加载状态
const loadingMenus = reactive({})

// 每个菜单对应的镜像列表
const menuMirrors = reactive({})

// 全局加载状态
const loading = ref(true)

// 监听架构切换，更新设备列表
watch(selectedArch, (newArch) => {
  if (newArch) {
    loadDevicesForArch(newArch)
  } else {
    deviceList.value = []
  }
})

onMounted(async () => {
  try {
    const menuList = await fetchMenuList()
    allMenus.value = menuList

    // 筛选出一级菜单（架构）
    archList.value = menuList.filter(menu => menu.level === 0)

    // 默认选中第一个架构
    if (archList.value.length > 0) {
      selectedArch.value = archList.value[0]
    }
  } catch (e) {
    console.error('获取菜单列表失败：' + e.message)
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
})

// 加载指定架构下的所有设备
function loadDevicesForArch(arch) {
  // 先找到该架构下的所有二级菜单
  const level2Menus = allMenus.value.filter(menu => menu.level === arch.id)

  // 再找到所有二级菜单下的三级菜单（设备）
  const level2Ids = level2Menus.map(m => m.id)
  deviceList.value = allMenus.value.filter(menu => level2Ids.includes(menu.level))
}

// 切换架构
function selectArch(arch) {
  selectedArch.value = arch
  // 清空之前的选中状态
  Object.keys(selectedMenus).forEach(key => {
    selectedMenus[key] = false
  })
}

async function handleMenuSelect(device) {
  // 切换展开/收起状态
  if (selectedMenus[device.id]) {
    selectedMenus[device.id] = false
    return
  }

  // 收起同一架构下的其他已展开的菜单项
  deviceList.value.forEach(d => {
    if (d.id !== device.id && selectedMenus[d.id]) {
      selectedMenus[d.id] = false
    }
  })

  // 展开当前菜单
  selectedMenus[device.id] = true

  // 如果已经加载过，不重复加载
  if (menuMirrors[device.id]) {
    return
  }

  // 加载该菜单的镜像列表
  loadingMenus[device.id] = true

  try {
    await fetchMirrorsForDevice(device)
  } catch (e) {
    console.error('获取镜像列表失败：' + e.message)
    ElMessage.error('获取镜像列表失败')
  } finally {
    loadingMenus[device.id] = false
  }
}

async function fetchMirrorsForDevice(device) {
  const arch = selectedArch.value ? selectedArch.value.title : ''
  const series = device.title

  // 只传arch和series，不传manufacturer（舍弃二级分类）
  const params = { arch, manufacturer: '', series }

  try {
    const mirrorList = await fetchMirrorList(params)
    menuMirrors[device.id] = mirrorList || []
  } catch (e) {
    console.error(`获取${series}镜像失败：` + e.message)
    menuMirrors[device.id] = []
  }
}

async function copyUrl(row) {
  try {
    await navigator.clipboard.writeText(row.urlInter)
    ElMessage.success('链接已复制')
  } catch (e) {
    ElMessage.error('复制失败：' + e.message)
  }
}

function openMirrorInter(row) {
  window.open(row.urlInter, '_blank')
}
</script>

<style scoped>
/* ===== 页面容器 ===== */
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  background: linear-gradient(135deg, #ffffff 0%, #fbfcfe 100%);
  min-height: 100vh;
}

/* ===== 通用区域样式 ===== */
.section-header {
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #1f2329;
  padding-bottom: 12px;
  border-bottom: 3px solid #5b5cf6;
  display: inline-block;
}

/* ===== 镜像区域 ===== */
.mirror-section {
  margin-bottom: 48px;
}

/* ===== 架构选择标签 ===== */
.arch-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.arch-tab {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.arch-tab:hover {
  color: #5b5cf6;
  border-color: #d4d4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 92, 246, 0.15);
}

.arch-tab.active {
  color: #fff;
  background: linear-gradient(135deg, #5b5cf6 0%, #7c7df6 100%);
  border-color: #5b5cf6;
  box-shadow: 0 6px 16px rgba(91, 92, 246, 0.3);
}

/* ===== 单个镜像区域 ===== */
.mirror-area {
  background: transparent;
  display: flex;
  flex-direction: column;
  height: 600px;
}

/* ===== 可滚动内容区域 ===== */
.area-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
}

.area-content::-webkit-scrollbar {
  width: 6px;
}

.area-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.area-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.area-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* ===== 菜单样式 ===== */
.area-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-group {
  border-radius: 8px;
  overflow: hidden;
}

.menu-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2329;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #5b5cf6;
  transform: translateX(2px);
}

.menu-item.active {
  background: #eef0ff;
  color: #5b5cf6;
}

.menu-text {
  flex: 1;
}

.menu-icon {
  font-size: 16px;
  transition: transform 0.3s;
  color: #9ca3af;
}

.menu-icon.expanded {
  color: #5b5cf6;
}

.menu-icon.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===== 镜像列表样式 ===== */
.mirror-list {
  margin-top: 8px;
  padding-left: 12px;
  border-left: 2px solid #e5e7eb;
}

.mirror-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: #ffffff;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  gap: 12px;
}

.mirror-item:hover {
  border-color: #5b5cf6;
  box-shadow: 0 2px 8px rgba(91, 92, 246, 0.15);
}

.mirror-main {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.mirror-name {
  display: block;
  font-size: 13px;
  color: #1f2329;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.mirror-name:hover {
  color: #5b5cf6;
  text-decoration: underline;
}

.mirror-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-tag {
  font-size: 11px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

.mirror-action {
  flex-shrink: 0;
}

.btn-copy {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  border-color: #5b5cf6;
  color: #5b5cf6;
  background: #f9fafb;
}

.mirror-empty {
  padding: 16px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
}

/* ===== 架构空状态 ===== */
.arch-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #6b7280;
}

.arch-empty .empty-icon {
  color: #d1d5db;
  margin-bottom: 16px;
}

.arch-empty .empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 8px;
}

.arch-empty .empty-desc {
  font-size: 14px;
  color: #9ca3af;
}

/* ===== 动画效果 ===== */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}

/* ===== 软件区域 ===== */
.software-section {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.maintenance-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
  color: #6b7280;
}

.maintenance-icon {
  color: #9ca3af;
  margin-bottom: 16px;
}

.maintenance-text {
  font-size: 20px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
}

/* ===== 响应式布局 ===== */
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .arch-tabs {
    gap: 8px;
  }

  .arch-tab {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
