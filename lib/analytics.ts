import prisma from './prisma';

export async function trackUserAction(
  userId: string,
  action: string,
  oldValue?: string,
  newValue?: string
) {
  try {
    await prisma.userAnalytics.create({
      data: {
        userId,
        action,
        oldValue,
        newValue,
      },
    });
  } catch (error) {
    console.error('Error tracking user action:', error);
  }
}

export async function updateDailyAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Get user counts by subscription type
    const subscriptionCounts = await prisma.user.groupBy({
      by: ['subscription'],
      _count: {
        subscription: true,
      },
    });

    // Get total generations for the day
    const dailyGenerations = await prisma.userAnalytics.count({
      where: {
        action: 'generation',
        createdAt: {
          gte: today,
        },
      },
    });

    // Create or update daily analytics
    await prisma.analytics.upsert({
      where: {
        id: today.toISOString().split('T')[0],
      },
      create: {
        id: today.toISOString().split('T')[0],
        basicPlanUsers: subscriptionCounts.find(c => c.subscription === 'Basic Plan')?._count.subscription ?? 0,
        proPlanUsers: subscriptionCounts.find(c => c.subscription === 'Pro Plan')?._count.subscription ?? 0,
        enterpriseUsers: subscriptionCounts.find(c => c.subscription === 'Enterprise Plan')?._count.subscription ?? 0,
        totalGenerations: dailyGenerations,
      },
      update: {
        basicPlanUsers: subscriptionCounts.find(c => c.subscription === 'Basic Plan')?._count.subscription ?? 0,
        proPlanUsers: subscriptionCounts.find(c => c.subscription === 'Pro Plan')?._count.subscription ?? 0,
        enterpriseUsers: subscriptionCounts.find(c => c.subscription === 'Enterprise Plan')?._count.subscription ?? 0,
        totalGenerations: dailyGenerations,
      },
    });
  } catch (error) {
    console.error('Error updating daily analytics:', error);
  }
} 