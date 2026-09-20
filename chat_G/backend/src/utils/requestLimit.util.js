const userModel = require("../models/user.model");

// Daily AI request limit per user (configurable via .env)
const AI_DAILY_REQUEST_LIMIT = Number(process.env.AI_DAILY_REQUEST_LIMIT) || 50;

// Local date key e.g. "2026-09-20" so the counter resets on a new day
const getTodayKey = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 10);
};

/**
 * @param {*} userId  mongo id of the user
 * @param {*} consume one ai request slot and return remaining count
 * @returns { success, allowed, exceeded, remaining }
 */
const consumeAiRequest = async (userId) => {
    try {
        const user = await userModel
            .findById(userId)
            .select("dailyRequestCount dailyRequestDate");

        if (!user) {
            return { success: false, allowed: false, exceeded: false, remaining: 0 };
        }

        const todayKey = getTodayKey();

        // new day -> reset the counter
        if (user.dailyRequestDate !== todayKey) {
            user.dailyRequestCount = 0;
            user.dailyRequestDate = todayKey;
        }

        if (user.dailyRequestCount >= AI_DAILY_REQUEST_LIMIT) {
            await user.save();

            return { success: true, allowed: false, exceeded: true, remaining: 0 };
        }

        user.dailyRequestCount += 1;
        await user.save();

        return {
            success: true,
            allowed: true,
            exceeded: false,
            remaining: AI_DAILY_REQUEST_LIMIT - user.dailyRequestCount,
        };
    } catch (error) {
        console.log(error);

        return { success: false, allowed: false, exceeded: false, remaining: 0 };
    }
};

/**
 * @param {*} userId  mongo id of the user
 * @param {*} get remaining ai requests without consuming a slot
 * @returns { Number }
 */
const getRemainingAiRequests = async (userId) => {
    try {
        const user = await userModel
            .findById(userId)
            .select("dailyRequestCount dailyRequestDate");

        if (!user) return 0;

        if (user.dailyRequestDate !== getTodayKey()) return AI_DAILY_REQUEST_LIMIT;

        return Math.max(AI_DAILY_REQUEST_LIMIT - user.dailyRequestCount, 0);
    } catch (error) {
        console.log(error);

        return 0;
    }
};

module.exports = {
    AI_DAILY_REQUEST_LIMIT,
    consumeAiRequest,
    getRemainingAiRequests,
};