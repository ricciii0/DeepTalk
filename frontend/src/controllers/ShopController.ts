import { ref } from 'vue'
import {ShopSearchAPI, ShopPurchaseAPI, ShopCheckStockAPI, ShopUseModelAPI} from '../api/ShopAPI'
import type { Product, Order, SearchRequest, SearchResponse, CheckStockRequest, CheckStockResponse,
    PurchaseRequest, PurchaseResponse, UseModelRequest, UseModelResponse } from '../interface/ShopInterface'
import userModel from '../models/user'

export const useShopController = () => {
    const productList = ref<Product[]>([])
    const order = ref<Order | null>(null)
    const loading = ref(false) 
    const error = ref<string | null>(null)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sampleProducts: Product[] = [
        {
            id: '1',
            name: '真寻',
            description: '绪山真寻Live2d',
            price: 648,
            imageUrl: '../public/live2d/Mahiro_GG/真寻.png'
        },
        {
            id: '2',
            name: 'miku',
            description: '初音未来Live2d',
            price: 328,
            imageUrl: '../public/live2d/miku/image.png'
        },
        {
            id: '3',
            name: '纳西妲',
            description: '草神Live2d',
            price: 128,
            imageUrl: '../public/live2d/Nahida_1080/icon.jpg'
        },
        {
            id: '4',
            name: '安哲拉',
            description: '安哲拉Live2d',
            price: 198,
            imageUrl: '../public/live2d/anzhela/anzhela.jpg'
        },
        {
            id: '5',
            name: '芙莉莲',
            description: '芙莉莲Live2d',
            price: 268,
            imageUrl: '../public/live2d/test1/fulilian.jpg'
        },
    ]
    // 加载商店启动数据：发送空搜索拉取商品列表
    const loadShopData = async () => {
        loading.value = true
        error.value = null
        try {
            //空搜索拉取商品
            const searchReq: SearchRequest = { query: '' }
            const searchRes: SearchResponse = await ShopSearchAPI(searchReq)
            productList.value = searchRes.products ?? []
            // // 模拟API调用延迟
            // await new Promise(resolve => setTimeout(resolve, 1000))
            // productList.value = sampleProducts

        } catch (e) {
            error.value = '加载失败，请稍后重试'
            console.error('加载商店数据失败:', e)
        } finally {
            loading.value = false
        }
    }
    // 搜索
    const searchProducts = async (keyword: string) => {
        loading.value = true
        error.value = null
        try {
            // 搜索商品
            const searchReq: SearchRequest = { query: keyword }
            const searchRes: SearchResponse = await ShopSearchAPI(searchReq)
            productList.value = searchRes.products ?? []

        } catch (e) {
            error.value = '搜索失败，请稍后重试'
                console.error('搜索失败:', e)
            } finally {
                loading.value = false
            }
        }
    // 购买商品
    const purchaseProduct = async (product: Product) => {
        loading.value = true
        error.value = null
        try {
            const purchaseReq: PurchaseRequest = { order: { id: '', userId: '', product } }
            const purchaseRes: PurchaseResponse = await ShopPurchaseAPI(purchaseReq)
            order.value = purchaseRes.order
        } catch (e) {
            error.value = '购买失败，请稍后重试'
            console.error('购买失败:', e)
        } finally {
            loading.value = false
        }
    }
    // 查看库存
    const checkStock = async (userId: string) => {
        loading.value = true
        error.value = null
        try {
            const stockReq: CheckStockRequest = { userId }
            const stockRes: CheckStockResponse = await ShopCheckStockAPI(stockReq)
            productList.value = stockRes.productList ?? []
        } catch (e) {
            error.value = '查看库存失败，请稍后重试'
            console.error('查看库存失败:', e)
        } finally {
            loading.value = false
        }
    }
    // 使用模型
    const useModel = async (productId: string): Promise<UseModelResponse> => {
        loading.value = true
        error.value = null
        try {
            const useReq: UseModelRequest = { 
                userId: userModel.userId,
                productId: productId
            }
            const response = await ShopUseModelAPI(useReq)
            if (response.status === 200) {
                return response
            } else {
                error.value = response.data
                return response
            }
        } catch (e) {
            error.value = e instanceof Error ? e.message : '使用模型失败，请稍后重试'
            console.error('使用模型失败:', e)
            return {
                status: 400,
                data: error.value
            }
        } finally {
            loading.value = false
        }
    }

    return {
        productList,
        order,
        loading,
        error,
        loadShopData,
        searchProducts,
        purchaseProduct,
        checkStock,
        useModel
    }
}


