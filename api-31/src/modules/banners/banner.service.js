const Joi = require("joi");
const { uploadHelper } = require("../../utilities/helpers");
const BannerModel = require("./banner.model");

class BannerService {
    transFormData = async (req, isEdit = false) => {
        const data = req.body;
        if(isEdit) {
            data.updatedBy = req.authUser._id;
        } else {
            data.createdBy = req.authUser._id;
        }

        if(req.file) {
            data.image = await uploadHelper(req.file.path, 'banners')
        } else {
            if(isEdit) {
                delete data.image
            }
        }
        return data;
    }

    createBanner =async (data) => {
        try {
            const banner = new BannerModel(data);
            return await banner.save()
        } catch(exception) {
            throw exception
        }
    }

    updateBanner =async(data, id) => {
        try {
            const update = await BannerModel.findByIdAndUpdate(id, {$set: data}, {new: true});
            return update;
        } catch(exception) {
            throw exception;
        }
    }

    deleteById = async(id) => {
        try {
            const update = await BannerModel.findByIdAndDelete(id);
            if(!update) {
                throw {code: 404, message: "Banner already deleted or does not exists.", status: "BANNER_DELETE_ERROR"}
            }
            return update;
        } catch(exception) {
            throw exception;
        }
    }

    listAllByfilter =async ({limit=15, skip=0, filter={}}) => {
        try {
            const total = await BannerModel.countDocuments(filter);

            const list = await BannerModel.find(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .populate("updatedBy", ["_id", "name", "email", "role"])
                .sort({createdAt: "desc"})
                .limit(limit)
                .skip(skip);
            return {list, total};
        } catch(exception) {
            throw exception;
        }
    }

    getSingleData = async(filter) => {
        try{
            const bannerDetail = await BannerModel.findOne(filter)
                .populate("createdBy", ["_id", "name", "email", "role"])
                .populate("updatedBy", ["_id", "name", "email", "role"])
            return  bannerDetail
        } catch(exception) {
            throw exception
        }
    }
}

const bannerSvc = new BannerService()
module.exports = bannerSvc;