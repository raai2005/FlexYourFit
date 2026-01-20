import { getInterviews, seedInterviews } from "@/lib/actions/interview.action";
import InterviewsPageContent from "./InterviewsPageContent";

export default async function InterviewsPage() {
  // Fetch data on the server
  let interviews = await getInterviews();

  return <InterviewsPageContent initialInterviews={interviews} />;
}
