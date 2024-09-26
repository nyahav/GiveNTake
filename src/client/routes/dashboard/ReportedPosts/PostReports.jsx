import { useState } from 'react'
import { $Wrapper, $Tabs, $TabItem } from './PostReports.styled'
import { Table } from 'flowbite-react'
import { REPORTS_REASONS } from '../../../utils/staticData'
import { usePostReports } from '../../../api/editor/usePostReports'

const TABS = {
  Pending: 'Pending',
  Ok: 'Ok'
}

const PostReports = ({ reportedPostId }) => {
  const [selectedTab, setSelectedTab] = useState(TABS.Pending)

  const {
    data: postReports,
    fetchNextPage: fetchNextPagePostReports,
    hasNextPage: hasNextPagePostReports
  } = usePostReports({ postId: reportedPostId, enabled: !!reportedPostId })
  console.log(postReports)

  return (
    <$Wrapper>
      <$Tabs>
        {Object.keys(TABS).map(currTab => (
          <$TabItem key={currTab} $isActive={selectedTab === currTab} onClick={() => setSelectedTab(currTab)}>
            {currTab}
          </$TabItem>
        ))}
      </$Tabs>
      <Table hoverable className="tblReports">
        <Table.Head>
          <Table.HeadCell>Report Reason</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y" style={{ cursor: 'pointer' }}>
          {postReports?.pages.map(page =>
            page?.docs.map(report => {
              if ((report?.isSeen && selectedTab === TABS.Ok) || (!report?.isSeen && selectedTab === TABS.Pending)) {
                return (
                  <Table.Row key={report._id}>
                    <Table.Cell>{REPORTS_REASONS[report.reasonKey]}</Table.Cell>
                    <Table.Cell>{report.description}</Table.Cell>
                    <Table.Cell>{report?.date}</Table.Cell>
                  </Table.Row>
                )
              }
            })
          )}
          {hasNextPagePostReports && (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <div className="flex justify-center">
                  <Button size="xs" color="light" onClick={fetchNextPagePostReports}>
                    Load more...
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </$Wrapper>
  )
}

export default PostReports
