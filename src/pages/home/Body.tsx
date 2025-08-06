import { Nav } from "./Nav"
import { Obj } from "./Obj"
import { Readme } from "./Readme"
import { Container } from "./Container"
import { Sidebar } from "./Sidebar"

export const Body = () => {
  return (
    <Container>
      <div class="mt-1 flex min-h-[80vh] w-full flex-col gap-4 px-[2%] py-2">
        <Readme files={["header.md", "top.md", "index.md"]} fromMeta="header" />
        <Nav />
        <Obj />
        <Readme
          files={["readme.md", "footer.md", "bottom.md"]}
          fromMeta="readme"
        />
        <Sidebar />
      </div>
    </Container>
  )
}
