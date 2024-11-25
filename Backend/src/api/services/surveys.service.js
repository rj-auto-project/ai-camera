import prisma from "../../config/prismaClient.js"

const getSurveysAnalyticsService = async () => {
    const totalSurveys = await prisma.survey.count()
    const totalReports = await prisma.surveyReport.count()

    const surveyByType = await prisma.survey.groupBy({
        by: ["type"],
        _count: { type: true }
    })

    const reportsByClassName = await prisma.surveyReport.groupBy({
        by: ["className"],
        _count: { className: true }
    })

    const topInitialDestinations = await prisma.survey.groupBy({
        by: ["initialDestination"],
        _count: { initialDestination: true },
        orderBy: { _count: { initialDestination: "desc" } },
        take: 5
    })

    const topFinalDestinations = await prisma.survey.groupBy({
        by: ["finalDestination"],
        _count: { finalDestination: true },
        orderBy: { _count: { finalDestination: "desc" } },
        take: 5
    })

    const reportsByLocation = await prisma.surveyReport.groupBy({
        by: ["location"],
        _count: { location: true },
        orderBy: { _count: { location: "desc" } },
        take: 5
    })

    const surveyPerDay = await prisma.survey.groupBy({
        by: ["date"],
        _count: { date: true },
        orderBy: { date: "asc" },
    })

    const reportsBySurvey = await prisma.survey.findMany({
        select: {
            id: true,
            surveyName: true,
            reports: {
                select: {
                    id: true,
                    className: true,
                    location: true,
                    thumbnail: true
                }
            }
        }
    })

    const reportThumbnails = await prisma.surveyReport.findMany({
        select: {
            thumbnail: true,
            className: true,
            location: true
        }
    })

    const data = {
        totalSurveys,
        totalReports,
        surveyByType,
        reportsByClassName,
        topInitialDestinations,
        topFinalDestinations,
        reportsByLocation,
        surveyPerDay,
        reportsBySurvey,
        reportThumbnails
    };

    return data
}

const getPaginatedSurveysService = async (offset, limit) => {
    const surveys = await prisma.survey.findMany({
        skip: offset,
        take: limit,
        orderBy: {
            date: "desc"
        }
    })

    return surveys || [];
}

const getSurveyReportsService = async (surveyId) => {
    const surveyReports = await prisma.surveyReport.findMany({
        where: {
            surveyId: surveyId
        }
    })

    return surveyReports || [];
}

const getSurveyReportsPDFService = async (surveyId) => {
    console.log("surveyId", surveyId)
    const surveyReports = await prisma.surveyReport.findMany({
        where: {
            surveyId: surveyId
        },
        include: {
            survey: true
        }
    })

    return surveyReports || [];
}

export { getSurveysAnalyticsService, getPaginatedSurveysService, getSurveyReportsService, getSurveyReportsPDFService }