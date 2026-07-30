import { db } from './lib/prisma';

async function checkData() {
  const users = await db.user.findMany({
    where: { industry: 'tech-software-development' },
    include: { industryInsight: true }
  });

  console.log('Users with tech-software-development:');
  console.log(JSON.stringify(users.map(u => ({
    id: u.id,
    industry: u.industry,
    hasInsight: !!u.industryInsight,
    insightId: u.industryInsight?.id
  })), null, 2));

  const insights = await db.industryInsight.findMany({
    where: { industry: 'tech-software-development' }
  });
  console.log('IndustryInsights for tech-software-development:');
  console.log(JSON.stringify(insights, null, 2));

  process.exit(0);
}

checkData();
