import Article from "../models/article.model"
import Category from "../models/category.model"

export const resolversArticle = {
    Query: {
        getListArticle: async (_, args) => {
            const { 
                sortKey, 
                sortValue, 
                currentPage, 
                limitItems,
                filterKey,
                filterValue,
                keyword
            } = args

            const find = {
                deleted: false
            }

            // Sort 
            const sort = {}

            if (sortKey && sortValue ) {
                sort[sortKey] = sortValue
            }

            // Pagination 
            const skip = (currentPage - 1) * limitItems

            // Filter 
            if (filterKey && filterValue) {
                find[filterKey] = filterValue
            }

            // Search 
            if (keyword) {
                const keywordRegex = new RegExp(keyword, "i")
                find["title"] = keywordRegex
            }

            const articles = await Article.find(find).sort(sort).limit(limitItems).skip(skip)
            
            return articles
        },

        getArticle: async (_, args) => {
            const { id } = args

            const article = await Article.findOne({
                _id: id, 
                deleted: false
            })
            return article
        }
    },

    Article: {
        category: async (article) => {
            const categoryId = article.categoryId

            const category = await Category.findOne({
                _id: categoryId
            })

            return category
        }
    },

    Mutation: {
        createArticle: async (_, args) => {
            const { article } = args;
        
            const newArticle = new Article(article);
            await newArticle.save();
        
            return newArticle;
        },

        deleteArticle: async (_, args) => {
            const { id } = args;
        
            await Article.updateOne({
                _id: id,
            }, {
                deleted: true,
                deletedAt: new Date()
            });
        
            return "Đã xóa!";
        },

        updateArticle: async (_, args) => {
            const { id, article } = args;
        
            await Article.updateOne({
                _id: id,
                deleted: false
            }, article);

            const record = await Article.findOne({
                _id: id,
            })
        
            return record;
        }
    }
}