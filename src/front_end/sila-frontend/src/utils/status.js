import { Tag } from "antd";

const ArticleStatus = {
  Submitted: "Submitted",
  ToBeReviewed: "ToBeReviewed",
  Reviewed: "Reviewed",
  WaitingForDecision: "WaitingForDecision",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Revised: "Revised",
  Withdrawn: "Withdrawn",
};

export function getStateTag(status) {
  if (status === ArticleStatus.Submitted) {
    return <Tag color="orange">Submitted</Tag>;
  } else if (status === ArticleStatus.ToBeReviewed) {
    return <Tag color="red">To Be Reviewed</Tag>;
  } else if (status === ArticleStatus.Reviewed) {
    return <Tag color="violet">Reviewed</Tag>;
  } else if (status === ArticleStatus.WaitingForDecision) {
    return <Tag color="green">Waiting For Decision</Tag>;
  } else if (status === ArticleStatus.Accepted) {
    return <Tag color="yellow">Accepted</Tag>;
  } else if (status === ArticleStatus.Rejected) {
    return <Tag color="purple">Rejected</Tag>;
  } else if (status === ArticleStatus.Revised) {
    return <Tag color="black">Revised</Tag>;
  } else if (status === ArticleStatus.Withdrawn) {
    return <Tag color="#66ccff">Withdrawn</Tag>;
  }
}
// Submitted
// ToBeReview
// WaitingFordecision      (review完成后，等待editor决定)
// Reviewed
// Approved         (editor的决定)
// Rejected   （editor的决定）
// Revised    (editor的决定)

export { ArticleStatus };
