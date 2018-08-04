import React, { Component } from 'react'
import '../css/content.css'
// import Figure from './figure.js'
// import Windows from './window.js'
// import MyTable from './table.js'
import {Cite, References} from './cite.js'
// import MathJax from './math.js'


class Content extends Component {
  constructor(props){
    super(props)
    this.titles = []
    this.references = [
      {
        name: 'the paper',
        text: "Pearson, J., Robinson, S. and Jones, M., 2015, April. It's About Time: Smartwatches as public displays. In Proceedings of the 33rd Annual ACM Conference on Human Factors in Computing Systems (pp. 1257-1266). ACM."
      },
      {
        name: 'Reshaping Future',
        text: 'Robinson, S. (2018). Reshaping the Expected Future. [online] Reshapingthefuture.org. Available at: http://www.reshapingthefuture.org/ [Accessed 27 Feb. 2018]. '
      },
      {
        name: 'Wearable technologies',
        text: 'Chuah, S.H.W., Rauschnabel, P.A., Krey, N., Nguyen, B., Ramayah, T. and Lade, S., 2016. Wearable technologies: The role of usefulness and visibility in smartwatch adoption. Computers in Human Behavior, 65, pp.276-284. '
      }
    ]
    this.Cite = this.Cite.bind(this)
    this.SectionTitle = this.SectionTitle.bind(this)
    this.Subtitle = this.Subtitle.bind(this)
  }
  componentDidMount(){
    this.props.parent.refs.title.update(this.titles)
  }
  Cite(props){
    return <Cite name={props.name} references={this.references}/>
  }
  SectionTitle(props){
    this.titles.push({
      type: 1,
      text: props.title
    })
    return <React.Fragment>
    <h2 className='sec-title'>{props.title}<a name={props.title} className='anchor'>{props.title}</a></h2>
    <hr className='sec-s'/>
    </React.Fragment>
  }
  Subtitle(props){
    this.titles.push({
      type: 2,
      text: props.title
    })
    return <React.Fragment>
    <h3 className='sec-sub-title'>{props.title}<a name={props.title} className='anchor'>{props.title}</a></h3>
    <hr className='sec-s-s'/>
    </React.Fragment>
  }
  render() {
    return (
      <div className="content">

        <hr/>
        <this.SectionTitle title='Keywords'/>
        <p>Review; Smartwatches; public displays; wearables; mobiles.</p>

        <this.SectionTitle title='Abstract'/>
        <p>This paper is to review the article, “It’s About Time: Smartwatches as Public Displays” <this.Cite name='the paper'/>, by Pearson et al. The article presents the idea of using smartwatch to display information for people rather than the one who wears it. This paper thus discusses the idea and the studies the authors of the paper held.</p>

        <this.SectionTitle title='The Review'/>

        <p>Overall, this is an innovative paper in which the authors propose a new research area of “display for others” and examine its feasibility through four studies.</p>

        <this.Subtitle title='About authors'/>
        <p>The authors of the paper are all professional researchers in Human Computer Interaction area. The first author, Pearson, and her colleague, Robinson, are research officers of the Future Interaction Technology Lab while Jones is a professor of computer science and also the head of College of Science: they are all working in Swansea University. They work closely with each other on a project called “Re-shaping the Expected Future”, the purpose of which is to create natural interaction for the poor who are expected to be able to afford devices used in developed world in the future so as to solve the contextual problems that they may face in interactions with those devices <this.Cite name='Reshaping Future'/>.</p>

        <this.Subtitle title='Background to the topic'/>
        <p>Many believe that watches nowadays become accessories especially for ladies as smartphones are must-have essentials. At the same time, wearable smart-devices start to attract more and more purchases and smartwatch as a typical and the most popular type of such devices becomes a type of fashnology (i.e., fashion and technology) <this.Cite name='Wearable technologies'/>. Watchmakers are keen on making their watches smarter by adding high-tech features (e.g. paying money like a credit card) so that they can prevail in marketing competition. Many ideas have been implemented on smartwatches now, but the idea that the paper being discussed proposes of public displays remains untouched, so it is fair to say that it is a very novel and innovative thought. With respect to privacy concerns which this paper shuns, the content of the display not for wearers themselves is no doubt detrimental (or just bootless) to the moral value (which is the fundamental value of privacy) of the possessor of the information. Therefore, this problem is still questioned by ethical and legal concerns.</p>

        <this.Subtitle title='Study design'/>
        <p>Four studies have been discussed in this paper. Study 1, designed to examine the ethical question, includes mainly an acceptability rating of glancing at the interlocutor’s wrist-watch. Study 2 then examined the feasibility of the glances, from different perspectives in various environments. Study 3 and 4 are based on the assumption that study 1 and 2 conclude that the glancing is an acceptable and feasible act. In study 3, researchers conducted a demographic survey to examine which pre-made interfaces were better than the others and also by the way to survey about the acceptability of glancing as a supplementary evidence. Study 4 consists only three participants wearing real smartwatches. They were asked to wear the smartwatches in their daily lives and record other people’s interactions with the watches so as to see how often people glanced at them.</p>
        <p>Overall the studies are well-designed and, in those studies, mathematical methods are precisely applied. However, the approaches and questionnaires made in study 1 might rise the suspicion of inducing participants to the presumption. Also, study 2 only considered visibility of the watch face but neglect the importance of the visibility of the content per se; the content of the watch face is usually less visible to the one who sits opposite to the wearer than to the wearer, even if their eyes from the same distance to the watch face. In study 3, limited by resources, using sketching and renderings in the survey was reasonable, but there were some factors difficult to be evaluated through pictures only. Study 4 in which there is only one group of data in each condition is less convincing, and smartwatches with a luminescent face worn by people who did not wear previously were implicitly attractive to those around them.</p>

        <this.Subtitle title='Implications and conclusions'/>
        <p>Thinking of that the purpose of having this fashnology in terms of public concern is usually to let it function as an accessory, smartwatch from the present point of view is mainly functionally useful to the wearer’s own convenience (e.g. keeping bearings). Privacy as a part of the content of individuality is also a sacred human right to which a smartwatch displaying information of someone else’s personal activities can hardly give consideration. Glancing someone’s watch for time-keeping or by way of aesthetic appreciation is beyond all doubt more socially and ethically acceptable than glancing for some information. In most case, it is politer to ask the wearer to tell the time or whatever public displays on her watch than to glance by oneself, let alone private activities.</p>

        <p>While the study takes acceptability into account, it is still unclear that whether or not such acts are acceptable, since, arguably, a thing with high acceptability does not have to be acceptable (think, for instance, a majority of people in the room smoke or accept people smoking does not mean smoking is acceptable in that room). There is a premise that the interests of a few others should also be taken care of. Hence, this review considers that smartwatches as public displays “is not yet about time.”</p>

        <p>None the less, this idea perhaps could come in handy someday in the unforeseeable part of the future. It is always too early to draw a conclusion on novelties. The paper tries to open up a new area of research. There are many unknowns to be discovered.</p>

        <this.SectionTitle title='References'/>
        <References references={this.references}/>

      </div>
    )
  }
}
export default Content
