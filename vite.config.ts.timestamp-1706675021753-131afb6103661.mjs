// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Job/JobResource/WebProjects/frontend-vue-learning/vue3-03-inaction/vue3-admin-template/node_modules/.pnpm/vite@5.0.11_@types+node@20.10.6_sass@1.69.7/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Job/JobResource/WebProjects/frontend-vue-learning/vue3-03-inaction/vue3-admin-template/node_modules/.pnpm/@vitejs+plugin-vue@4.6.2_vite@5.0.11_vue@3.4.5/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { createSvgIconsPlugin } from "file:///C:/Job/JobResource/WebProjects/frontend-vue-learning/vue3-03-inaction/vue3-admin-template/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.0.11/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { viteMockServe } from "file:///C:/Job/JobResource/WebProjects/frontend-vue-learning/vue3-03-inaction/vue3-admin-template/node_modules/.pnpm/vite-plugin-mock@2.9.8_mockjs@1.1.0_vite@5.0.11/node_modules/vite-plugin-mock/dist/index.js";
import VueSetupExtend from "file:///C:/Job/JobResource/WebProjects/frontend-vue-learning/vue3-03-inaction/vue3-admin-template/node_modules/.pnpm/vite-plugin-vue-setup-extend@0.4.0_vite@5.0.11/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
import path from "path";
var vite_config_default = defineConfig(({ command, mode }) => {
  var env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        // Specify symbolId format
        symbolId: "icon-[dir]-[name]"
      }),
      viteMockServe({
        mockPath: "mock",
        localEnabled: command === "serve"
        // 保证开发阶段可以使用mock接口
      }),
      VueSetupExtend()
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src")
        // 相对路径别名配置，使用 @ 代替 src
      }
    },
    // scss全局遍历配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    // 代理服务器
    server: {
      proxy: {
        // 登录相关接口
        [env.VITE_APP_BASE_API_8212]: {
          // 获取数据的服务器的地址设置
          target: env.VITE_SERVE_8212,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path2) => path2.replace(/^\/api_8212/, "")
        },
        // 其他业务接口
        [env.VITE_APP_BASE_API_8209]: {
          // 获取数据的服务器的地址设置
          target: env.VITE_SERVE_8209,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path2) => path2.replace(/^\/api_8209/, "")
        },
        // 默认配置
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器的地址设置
          target: env.VITE_SERVE,
          // 需要代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxKb2JcXFxcSm9iUmVzb3VyY2VcXFxcV2ViUHJvamVjdHNcXFxcZnJvbnRlbmQtdnVlLWxlYXJuaW5nXFxcXHZ1ZTMtMDMtaW5hY3Rpb25cXFxcdnVlMy1hZG1pbi10ZW1wbGF0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcSm9iXFxcXEpvYlJlc291cmNlXFxcXFdlYlByb2plY3RzXFxcXGZyb250ZW5kLXZ1ZS1sZWFybmluZ1xcXFx2dWUzLTAzLWluYWN0aW9uXFxcXHZ1ZTMtYWRtaW4tdGVtcGxhdGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0pvYi9Kb2JSZXNvdXJjZS9XZWJQcm9qZWN0cy9mcm9udGVuZC12dWUtbGVhcm5pbmcvdnVlMy0wMy1pbmFjdGlvbi92dWUzLWFkbWluLXRlbXBsYXRlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgY3JlYXRlU3ZnSWNvbnNQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1zdmctaWNvbnMnXG5pbXBvcnQgeyB2aXRlTW9ja1NlcnZlIH0gZnJvbSAndml0ZS1wbHVnaW4tbW9jaydcbmltcG9ydCBWdWVTZXR1cEV4dGVuZCBmcm9tICd2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kLCBtb2RlIH0pID0+IHtcbiAgLy8gXHU4M0I3XHU1M0Q2XHU1NDA0XHU3OUNEXHU3M0FGXHU1ODgzXHU0RTBCXHU3Njg0XHU1QkY5XHU1RTk0XHU3Njg0XHU1M0Q4XHU5MUNGXG4gIHZhciBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgdnVlKCksXG4gICAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XG4gICAgICAgIC8vIFNwZWNpZnkgdGhlIGljb24gZm9sZGVyIHRvIGJlIGNhY2hlZFxuICAgICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnc3JjL2Fzc2V0cy9pY29ucycpXSxcbiAgICAgICAgLy8gU3BlY2lmeSBzeW1ib2xJZCBmb3JtYXRcbiAgICAgICAgc3ltYm9sSWQ6ICdpY29uLVtkaXJdLVtuYW1lXScsXG4gICAgICB9KSxcbiAgICAgIHZpdGVNb2NrU2VydmUoe1xuICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxuICAgICAgICBsb2NhbEVuYWJsZWQ6IGNvbW1hbmQgPT09ICdzZXJ2ZScsIC8vIFx1NEZERFx1OEJDMVx1NUYwMFx1NTNEMVx1OTYzNlx1NkJCNVx1NTNFRlx1NEVFNVx1NEY3Rlx1NzUyOG1vY2tcdTYzQTVcdTUzRTNcbiAgICAgIH0pLFxuICAgICAgVnVlU2V0dXBFeHRlbmQoKSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKCcuL3NyYycpLCAvLyBcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdTUyMkJcdTU0MERcdTkxNERcdTdGNkVcdUZGMENcdTRGN0ZcdTc1MjggQCBcdTRFRTNcdTY2RkYgc3JjXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gc2Nzc1x1NTE2OFx1NUM0MFx1OTA0RFx1NTM4Nlx1OTE0RFx1N0Y2RVxuICAgIGNzczoge1xuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6ICdAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL3ZhcmlhYmxlLnNjc3NcIjsnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFx1NEVFM1x1NzQwNlx1NjcwRFx1NTJBMVx1NTY2OFxuICAgIHNlcnZlcjoge1xuICAgICAgcHJveHk6IHtcbiAgICAgICAgLy8gXHU3NjdCXHU1RjU1XHU3NkY4XHU1MTczXHU2M0E1XHU1M0UzXG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUElfODIxMl06IHtcbiAgICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdTU3MzBcdTU3NDBcdThCQkVcdTdGNkVcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1NFUlZFXzgyMTIsXG4gICAgICAgICAgLy8gXHU5NzAwXHU4OTgxXHU0RUUzXHU3NDA2XHU4REU4XHU1N0RGXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIC8vIFx1OERFRlx1NUY4NFx1OTFDRFx1NTE5OVxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlfODIxMi8sICcnKSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gXHU1MTc2XHU0RUQ2XHU0RTFBXHU1MkExXHU2M0E1XHU1M0UzXG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUElfODIwOV06IHtcbiAgICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTY1NzBcdTYzNkVcdTc2ODRcdTY3MERcdTUyQTFcdTU2NjhcdTc2ODRcdTU3MzBcdTU3NDBcdThCQkVcdTdGNkVcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1NFUlZFXzgyMDksXG4gICAgICAgICAgLy8gXHU5NzAwXHU4OTgxXHU0RUUzXHU3NDA2XHU4REU4XHU1N0RGXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIC8vIFx1OERFRlx1NUY4NFx1OTFDRFx1NTE5OVxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlfODIwOS8sICcnKSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gXHU5RUQ4XHU4QkE0XHU5MTREXHU3RjZFXG4gICAgICAgIFtlbnYuVklURV9BUFBfQkFTRV9BUEldOiB7XG4gICAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTcwXHU2MzZFXHU3Njg0XHU2NzBEXHU1MkExXHU1NjY4XHU3Njg0XHU1NzMwXHU1NzQwXHU4QkJFXHU3RjZFXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9TRVJWRSxcbiAgICAgICAgICAvLyBcdTk3MDBcdTg5ODFcdTRFRTNcdTc0MDZcdThERThcdTU3REZcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgLy8gXHU4REVGXHU1Rjg0XHU5MUNEXHU1MTk5XG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMmMsU0FBUyxjQUFjLGVBQWU7QUFDamYsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sb0JBQW9CO0FBQzNCLE9BQU8sVUFBVTtBQUdqQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFNBQVMsS0FBSyxNQUFNO0FBRWpELE1BQUksTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFDckMsU0FBTztBQUFBLElBQ0wsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0oscUJBQXFCO0FBQUE7QUFBQSxRQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLGtCQUFrQixDQUFDO0FBQUE7QUFBQSxRQUUxRCxVQUFVO0FBQUEsTUFDWixDQUFDO0FBQUEsTUFDRCxjQUFjO0FBQUEsUUFDWixVQUFVO0FBQUEsUUFDVixjQUFjLFlBQVk7QUFBQTtBQUFBLE1BQzVCLENBQUM7QUFBQSxNQUNELGVBQWU7QUFBQSxJQUNqQjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsT0FBTztBQUFBO0FBQUEsTUFDM0I7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLEtBQUs7QUFBQSxNQUNILHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLG1CQUFtQjtBQUFBLFVBQ25CLGdCQUFnQjtBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBO0FBQUEsUUFFTCxDQUFDLElBQUksc0JBQXNCLEdBQUc7QUFBQTtBQUFBLFVBRTVCLFFBQVEsSUFBSTtBQUFBO0FBQUEsVUFFWixjQUFjO0FBQUE7QUFBQSxVQUVkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLGVBQWUsRUFBRTtBQUFBLFFBQ25EO0FBQUE7QUFBQSxRQUVBLENBQUMsSUFBSSxzQkFBc0IsR0FBRztBQUFBO0FBQUEsVUFFNUIsUUFBUSxJQUFJO0FBQUE7QUFBQSxVQUVaLGNBQWM7QUFBQTtBQUFBLFVBRWQsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZUFBZSxFQUFFO0FBQUEsUUFDbkQ7QUFBQTtBQUFBLFFBRUEsQ0FBQyxJQUFJLGlCQUFpQixHQUFHO0FBQUE7QUFBQSxVQUV2QixRQUFRLElBQUk7QUFBQTtBQUFBLFVBRVosY0FBYztBQUFBO0FBQUEsVUFFZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
