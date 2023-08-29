import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import sportGarage from "../assets/img/sport-garage.svg";
import personalWebsite from "../assets/img/personal-website.svg";
import fileManagementSystem from "../assets/img/file-management-systems.svg";
import realtimeChat from "../assets/img/realtimeChatApp.svg";
import portfolioDesign from "../assets/img/portfolio-design.svg";
import myClassDesign from "../assets/img/kelasku-design.svg";
import colorSharp2 from "../assets/img/color-sharp2.png";
import "animate.css";
import TrackVisibility from "react-on-screen";
import "../App.css";

export const Projects = () => {
	const projects1 = [
		{
			title: "Realtime Chat App",
			description: "React & Node.js",
			imgUrl: realtimeChat,
		},
		{
			title: "Personal Website",
			description: "HTML, CSS and JS",
			imgUrl: personalWebsite,
		},
		{
			title: "Portfolio with React JS",
			description: "First website to study this framework",
			imgUrl: fileManagementSystem,
		},
		{
			title: "Sport E-Commerce",
			description: "UI Design Project",
			imgUrl: sportGarage,
		},
		{
			title: "Portfolio Design",
			description: "Design with Figma",
			imgUrl: portfolioDesign,
		},
		{
			title: "MyClass App",
			description: "UI Design Project",
			imgUrl: myClassDesign,
		},
	];

	return (
		<section className="project" id="project">
			<Container>
				<Row>
					<Col size={12}>
						<TrackVisibility>
							{({ isVisible }) => (
								<div
									className={
										isVisible ? "animate__animated animate__fadeIn" : ""
									}
								>
									<h2>Projects</h2>
									<p>
										Here you can see what projects I've worked on. From design
										to coding. I create these projects with a passion to produce
										quality projects. Hover over to see the title and
										description about the project.
									</p>
									<Tab.Container id="projects-tabs" defaultActiveKey="first">
										<Nav
											variant="pills"
											className="nav-pills mb-5 justify-content-center align-items-center"
											id="pills-tab"
										>
											<Nav.Item>
												<Nav.Link eventKey="first">Projects</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey="second">Details</Nav.Link>
											</Nav.Item>
											<Nav.Item>
												<Nav.Link eventKey="third">Details</Nav.Link>
											</Nav.Item>
										</Nav>
										<Tab.Content
											id="slideInUp"
											className={
												isVisible ? "animate__animated animate__slideInUp" : ""
											}
										>
											<Tab.Pane eventKey="first">
												<Row>
													{projects1.map((project, index) => {
														return <ProjectCard key={index} {...project} />;
													})}
												</Row>
											</Tab.Pane>
											<Tab.Pane eventKey="second">
												<div className="left">
													<h1 className="center">Realtime Chat App</h1>
													<p>
														First time making realtime chat like whatsapp,
														telegram, etc. I made this chat using ChatEngine,
														for design, i imported the module and then I changed
														it a little bit.
													</p>
												</div>
												<div className="left">
													<h1 className="center">Personal Website</h1>
													<p>
														Trying to create a portfolio in the Laravel
														Framework to learn more about this framework.
													</p>
												</div>
												<div className="left">
													<h1 className="center">Portfolio with React JS</h1>
													<p>
														This is my first website with react development kit.
														I make this website since January 2023.
													</p>
												</div>
											</Tab.Pane>
											<Tab.Pane eventKey="third">
												<div className="left">
													<h1 className="center">Sport E-Commerce</h1>
													<p>
														This is my first application design when I learn
														Figma software. This design still has a lot of
														problems, such as inconsistent margins and padding,
														inappropriate and incompatible color selection.
													</p>
												</div>
												<div className="left">
													<h1 className="center">Portfolio Design</h1>
													<p>
														I made this design because of the final industrial
														class final project.
													</p>
												</div>
												<div className="left">
													<h1 className="center">MyClass App</h1>
													<p>
														This design is the first project design in the
														advanced industrial class.
													</p>
												</div>
											</Tab.Pane>
										</Tab.Content>
									</Tab.Container>
								</div>
							)}
						</TrackVisibility>
					</Col>
				</Row>
			</Container>
			<img className="background-image-right" src={colorSharp2}></img>
		</section>
	);
};
