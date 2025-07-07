import strawberry
from app.schema import Portfolio, TimelineEntry, Project, Metric
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

def fake_portfolio():
    # Replace with real DB fetch
    return Portfolio(
        timeline=[
            TimelineEntry(id=1, title='Senior Manager', company='Momnt', start='2023', end='2025', summary='Refactored product & data pipeline.'),
            TimelineEntry(id=2, title='CTO/CFO', company='Superior', start='2018', end='2023', summary='Scaled ops & tech.')
        ],
        projects=[
            Project(id=1, name='Underwriting AI', stack='Python, ML', description='LLM credit risk engine.'),
            Project(id=2, name='ERP Integration', stack='NetSuite, APIs', description='API/ERP transformation.')
        ],
        metrics=[
            Metric(id=1, label='Companies Scaled', value='4'),
            Metric(id=2, label='Capital Raised ($MM)', value='100+')
        ]
    )

@strawberry.type
class Query:
    portfolio: Portfolio = strawberry.field(resolver=fake_portfolio)

schema = strawberry.Schema(Query)
graphql_app = GraphQLRouter(schema)
