import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import applicationsRouter from "./applications";
import reviewsRouter from "./reviews";
import usersRouter from "./users";
import classSessionsRouter from "./classSessions";
import settingsRouter from "./settings";
import notificationsRouter from "./notifications";
import paymentsRouter from "./payments";
import auditLogsRouter from "./auditLogs";
import businessInquiryRouter from "./businessInquiry";
import aiChatRouter from "./ai-chat";
import pricingRouter from "./pricing";
import adminOpsRouter from "./admin-ops";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(applicationsRouter);
router.use(reviewsRouter);
router.use(usersRouter);
router.use(classSessionsRouter);
router.use(settingsRouter);
router.use(notificationsRouter);
router.use(paymentsRouter);
router.use(auditLogsRouter);
router.use(businessInquiryRouter);
router.use(aiChatRouter);
router.use(pricingRouter);
router.use(adminOpsRouter);

export default router;
